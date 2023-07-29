import { Document, Model } from "mongoose";
import { Request } from "express";
import * as _ from "lodash";

import { IPagination } from "../interface/IPagination";

export class Pagination<Collection extends Document> {
  protected collection: Model<Collection>;

  constructor(model: Model<Collection>) {
    this.collection = model;
  }

  async paging(
    paginationDto: IPagination,
    queryAggregate?: any,
    select?: string
  ) {
    let data: any;
    let counter: number;
    if (paginationDto.paging != undefined) {
      if (queryAggregate != undefined) {
        data = await this.collection.aggregate([
          {
            $match: {
              ...paginationDto.filter,
            },
          },
          ...queryAggregate,
        ]);
      } else {
        data = await this.collection
          .find(paginationDto.filter)
          .select(select ? select : "");
      }

      return {
        data,
        rowCount: data.length,
      };
    }
    if (queryAggregate != undefined) {
      data = await this.collection
        .aggregate([
          {
            $match: {
              ...paginationDto.filter,
            },
          },
          ...queryAggregate,
        ])
        .limit(paginationDto.limit)
        .skip(paginationDto.skip);
      let aggDoc = await this.collection.aggregate([
        {
          $match: {
            ...paginationDto.filter,
          },
        },
        ...queryAggregate,
        { $count: "counter" },
      ]);
      if (aggDoc.length > 0) counter = aggDoc[0]["counter"];
      else counter = 0;
    } else {
      data = await this.collection
        .find(paginationDto.filter)
        .select(select ? select : "")
        .sort(paginationDto.sort)
        .limit(paginationDto.limit)
        .skip(paginationDto.skip);
      counter = await this.collection.countDocuments(paginationDto.filter);
    }

    return {
      data,
      totalPage: Math.ceil(counter / paginationDto.limit),
      rowCount: counter,
    };
  }

  static parsePaginationQuery = (req: Request) => {
    let pagination: IPagination = {
      filter: {},
      limit: 20, // Config.pagination.limit
      skip: 0, //Config.pagination.offset;
      sort: {},
    };

    // if (req.query !== null) {
    //   let { limit, offset, sortBy } = req.query;
    //   pagination.filter = { ...req.query };
    //   pagination.limit = Number(limit) || 20; // Config.pagination.limit;
    //   pagination.skip = Number(offset) || 0; //Config.pagination.offset;
    //   delete pagination.filter?.limit;
    //   delete pagination.filter?.offset;
    //   pagination.sort = {};
    //   if (sortBy) {
    //     delete pagination.filter.sortBy;
    //     let sortArr = String(sortBy).split(",");
    //     if (sortArr.length > 0) {
    //       for (let i in sortArr) {
    //         if (sortArr[i].startsWith("desc(")) {
    //           let fieldName = sortArr[i].substring(5, sortArr[i].length - 1);
    //           pagination.sort[fieldName] = -1;
    //         } else if (sortArr[i].startsWith("asc(")) {
    //           let fieldName = sortArr[i].substring(4, sortArr[i].length - 1);
    //           pagination.sort[fieldName] = 1;
    //         }
    //       }
    //     }
    //   }
    //   Object.keys(pagination.filter).forEach((key) => {
    //     if (_.isString(pagination.filter[key])) {
    //       pagination.filter[key] = new RegExp(`.*${pagination.filter[key]}.*`);
    //       return;
    //     }
    //     // url format: base-url/route?query=something&createAt[gte]=yyyy-mm-dd&createAt[lte]=yyyy-mm-dd
    //     // change filter to format to filter startDate -> endDate  {key: {'$gte': ISODate('yyyy-mm-dd'), '$lte': ISODate('yyyy-mm-dd')}
    //     if (Object.keys(pagination.filter[key]).includes("gte" && "lte")) {
    //       pagination.filter[key]["$gte"] = new Date(
    //         pagination.filter[key]["gte"]
    //       );
    //       delete pagination.filter[key]["gte"];
    //       pagination.filter[key]["$lte"] = new Date(
    //         pagination.filter[key]["lte"]
    //       );
    //       delete pagination.filter[key]["lte"];
    //     }
    //   });
    // }
    // return pagination;

    const { startRow, endRow, filterModel, sortModel } = req.query;
    if (sortModel != undefined) {
      pagination.sort = {
        [sortModel[0].colId]: sortModel[0].sort == "desc" ? -1 : 1,
      };
    } else {
      delete pagination.sort;
    }

    let filterOptions = {};
    if (filterModel != undefined && Object.keys(filterModel).length > 0) {
      Object.entries(filterModel).forEach((entry) => {
        const [key, value] = entry as any;
        if (value.filterType == "text") {
          switch (value.type) {
            case "contains":
              filterOptions[key] = new RegExp(".*" + value.filter + ".*", "i");
              break;
            case "notContains":
              filterOptions[key] = new RegExp(
                "^((?!" + value.filter + ").)*$",
                "i"
              );
              break;
            case "startsWith":
              filterOptions[key] = new RegExp("^" + value.filter, "i");
              break;
            case "endsWith":
              filterOptions[key] = new RegExp(value.filter + "$", "i");
              break;
          }
        } else if (value.filterType == "number") {
          switch (value.type) {
            case "equals":
              filterOptions[key] = value.filter;
              break;
            case "lessThan":
              filterOptions[key] = { $lt: value.filter };
              break;
            case "greaterThan":
              filterOptions[key] = { $gt: value.filter };
              break;
            case "inRange":
              filterOptions[key] = { $gt: value.filter, $lt: value.filterTo };
              break;
          }
        } else if (value.filterType == "date") {
          switch (value.type) {
            case "equals":
              filterOptions[key] = new Date(value.filter);
              break;
            case "lessThan":
              filterOptions[key] = { $lt: new Date(value.filter) };
              break;
            case "greaterThan":
              filterOptions[key] = { $gt: new Date(value.filter) };
              break;
            case "inRange":
              filterOptions[key] = {
                $gt: isNaN(Number(value.dateFrom))
                  ? new Date(value.dateFrom)
                  : Number(value.dateFrom),
                $lt: isNaN(Number(value.dateTo))
                  ? new Date(value.dateTo)
                  : Number(value.dateTo),
              };
              break;
          }
        } else if (value.filterType == "set") {
          let query = { $or: [] };
          filterModel[key]["values"].forEach((v) => {
            query.$or.push({ [key]: v });
          });
          filterOptions = query;
        } else {
          filterOptions[key] = value.filter;
        }
      });
    }

    pagination.filter = filterOptions;
    pagination.skip = Number(startRow) || 0;
    pagination.limit = Number(endRow) || 20 - pagination.skip;

    if (startRow === undefined || endRow === undefined)
      pagination.paging = false;
    return pagination;
  };
}

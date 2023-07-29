export function differentValue(oldValue: [], newValue: []) {
  let add = [],
    sub = [];
  oldValue.forEach((k) => {
    if (!newValue.includes(k)) {
      sub.push(k);
    }
  });
  newValue.forEach((k) => {
    if (!oldValue.includes(k)) {
      add.push(k);
    }
  });
  return {
    add,
    sub,
  };
}

// Calculate tick from 01/01/2000
export function tickNow() {
  const start = 946659600000; // tick from 01/01/2000
  return Date.now() - start;
}

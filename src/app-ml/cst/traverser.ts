export const toAst = cst => {
  const children = cst.children;
  switch (cst.name) {
    case "appStatement": {
      // ...
    }
    case "appClause": {
    }
    // ... more cases
    default: {
      throw new Error(
        `CST case handler not implemented for CST node <${cst.name}>`
      );
    }
  }
};

import classNames from 'classnames';

function uniqueOnly(value, index, self) {
  return self.indexOf(value) === index;
}

function flatten(a, b) {
  return a.concat(Array.isArray(b) ? flatten(b) : b);
}

export default function createStyler(...args) {
  return (...classes) => {
    if (args.length === 0) return classNames(classes);
    const allClasses = args.map((f) => {
      const foundClasses = classes.map((className) => {
        if (f[className]) return f[className];
        return className;
      });

      return foundClasses;
    }).reduce(flatten, []).filter(uniqueOnly);

    return classNames.apply([], allClasses);
  };
}

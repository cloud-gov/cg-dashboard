import classNames from 'classnames';

function uniqueOnly(value, index, self) {
  return self.indexOf(value) === index;
}

export default function createStyler(...args) {
  return (className) => {
    if (args.length === 0) return classNames(className);
    const classes = args.map((f) => {
      if (f[className]) return f[className];
      return className;
    }).filter(uniqueOnly);

    return classNames.apply([], classes);
  };
}

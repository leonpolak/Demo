const notEmpty = (s) => s.length > 0;

const cutBullet = (s, len = 1) => s.substring(len).trim();

class DomainStep {
  constructor(command) {
    this.command = command;
    this.success = [];
    this.fail = [];
    this.finalization = [];
  }
}

class DomainProcedure {
  constructor(name) {
    this.name = name;
    this.body = [];
  }
}

const BULLETS = [
  ['*', 'command'],
  ['- >', 'finalization'],
  ['-', 'fail'],
  ['+', 'success'],
];

const parseLine = (line) => {
  const str = line.trim();
  const [bullet, type] = BULLETS.find(([bullet]) => str.startsWith(bullet));
  return { type, text: cutBullet(str, bullet.length) };
};

const last = (array) => array[array.length - 1];

const parseProc = (src) => {
  const pos = src.indexOf('\n');
  const name = src.substring(0, pos).trim();
  const procedure = new DomainProcedure(name);
  const lines = src.substring(pos).trim().split('\n');
  for (const line of lines) {
    const { type, text } = parseLine(line);
    if (type === 'command') {
      procedure.body.push(new DomainStep(text));
    } else {
      last(procedure.body)[type].push(text);
    }
  }
  return procedure;
};

const parseProcess = (src) => src.split('# ').filter(notEmpty).map(parseProc);

export default { parseProcess };

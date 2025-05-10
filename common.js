
const Log = (s, l) => {
    const t = (new Date());

    let v;
    if (typeof l === 'string') v = l;
    else v = JSON.stringify(l);
    const timestamp = `${t.toDateString()} : ${t.toTimeString()}`;
    console.log(`${timestamp} ${s}: ${v}`);
};

module.exports = {
    Log: Log
};

const { stat: sql } = require('../sql');
const { connect } = require('../utils/dbConnectionPostgres');

const tableName = 'stat';

const getStat = async () => {
  const conn = await connect();

  const response = await conn.query(sql.getStat);

  if (!response) {
    return new AppError(`Couldn't get ${tableName} data`, 404);
  }

  return response;
};

const insertStat = async (payload) => {
  const conn = await connect();

  const columns = [
    'pool',
    'count',
    'meanAPY',
    'mean2APY',
    'meanDR',
    'mean2DR',
    'productDR',
  ];
  const cs = new pgp.helpers.ColumnSet(columns, { table: tableName });

  // multi-row insert/update
  const query =
    pgp.helpers.insert(payload, cs) +
    ' ON CONFLICT(pool) DO UPDATE SET ' +
    cs.assignColumns({ from: 'EXCLUDED', skip: 'pool' });

  const response = await conn.result(query);

  if (!response) {
    return new AppError(`Couldn't insert/update ${tableName} data`, 404);
  }

  return response;
};

modulex.exports = {
  getStat,
  insertStat,
};

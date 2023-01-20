import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  password: "postgres",
  database: "postgres",
  username: "postgres"
});

class Test extends Model<InferAttributes<Test>, InferCreationAttributes<Test>> {
  declare c1: string;
  declare c2: CreationOptional<string|null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
Test.init({
  c1: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  c2: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, { sequelize, modelName: 'tests' });

const c = "test";
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

async function sample1() {
  await sequelize.transaction(async t => {
    const [test, _new] = await Test.findOrCreate({
      where: {
        c1: c
      },
      defaults: {
        c1: c,
        c2: "sample1"
      },
      transaction: t
    });
    if (_new) {
      console.log("created test");
    } else {
      await test.update({ c2: "sample1-update" }, { transaction: t });
    }

    await sleep(1000);
    
    console.log("end sample1");
  });
}

async function sample2() {
  await sequelize.transaction(async t => {
    const test = await Test.findOne({
      where: {
        c1: c
      },
      transaction: t
    });
    if (test === null) {
      console.log('Not found');
    } else {
      await test.update({ c2: null }, { transaction: t });
    }
    
    await sleep(1000);
    
    console.log("end sample2");
  });
}

(async () => {

  console.log("syncing");
  await sequelize.sync({ force: true });
  console.log("synced");

  await sample1();

  await sample2();

  await sequelize.close();
  console.log("closed");
})();
import parser from 'yargs-parser';

export enum PublishType {
  NORMAL = 'assets',
  OVERWRITE = 'assets_o',
  TNPM = 'tnpm',
}

export enum PublishEnv {
  DAILY = 'daily',
  PROD = 'PROD',
}

export interface IBuildArgv {
  // 发布类型，如 assets、tnpm 等
  def_publish_type: PublishType;
  // 迭代版本号，如 0.0.1
  def_publish_version: string;
  // 发布的环境（默认不传，当应用开启线上构建时会注入）
  def_publish_env: PublishEnv;
  // 应用 id
  def_work_app_id: string;
}

const buildArgvObject = (
  process.env.BUILD_ARGV_STR ? parser(process.env.BUILD_ARGV_STR) : {}
) as Partial<IBuildArgv>;

export const publishVersion = buildArgvObject.def_publish_version;

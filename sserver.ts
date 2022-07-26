#!/usr/bin/env -S deno run -A

import { serve } from 'https://deno.land/std@0.149.0/http/server.ts';

// 帮助信息
{
  const i = Deno.args.findIndex((v) =>
    v.slice(0, 6) === '--help' || v.slice(0, 2) === '-h'
  );
  if (i !== -1) {
    console.log(`启动一个 file 服务

支持两个参数:

  -h --help   帮助信息.

  --port=     指定 Web 服务的端口. 默认 8080.

  --dir=      [必填] 指定一个文件夹作为主地址地址.
`);
    Deno.exit();
  }
}

let port = 8080;
// 指定 config 文件地址
{
  const i = Deno.args.findIndex((v) => v.slice(0, 7) === '--port=');
  if (i !== -1) {
    port = Number(Deno.args[i].slice(7));
  }
}

let dir = '';
// 指定 config 文件地址
{
  const i = Deno.args.findIndex((v) => v.slice(0, 6) === '--dir=');
  if (i !== -1) {
    dir = Deno.args[i].slice(6);
    if (dir.endsWith('/')) {
      dir = dir.slice(0, -1);
    }
  }
}

const handler = (req: Request): Response => {
  const u = new URL(req.url);

  // TODO: 支持 POST 方法
  // TODO: 支持 DELETE 方法
  // TODO: 支持简单鉴权
  console.log(`${req.method} ${u.pathname}`);

  try {
    const file = Deno.readFileSync(dir + u.pathname);
    return new Response(file, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('404', { status: 404 });
  }
};

// TODO: 支持自动生成证书
// TODO: 支持 HTTPS

console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);
await serve(handler, { port });

type RuntimeEnv = {
  HOST?: string;
  PORT?: string;
};

function parsePort(value: string | undefined) {
  if (!value) {
    return 8080;
  }

  const port = Number.parseInt(value, 10);

  if (!Number.isInteger(port) || port <= 0) {
    return 8080;
  }

  return port;
}

export function getRuntimeBinding(env: RuntimeEnv) {
  return {
    host: env.HOST?.trim() || "0.0.0.0",
    port: parsePort(env.PORT)
  };
}

export type Config = {
  // relay-butler specific
  componentsDirectory: string;

  // relay.config.js specific
  schema: string;
  artifactDirectory?: string;
};

export type RelayConfig = {
  schema?: string;
};

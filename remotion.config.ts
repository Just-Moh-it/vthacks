import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind";
import path from "path";

Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind({
    ...currentConfiguration,
    module: {
      ...currentConfiguration.module,
      rules: [
        ...(currentConfiguration.module?.rules ?? []),
        // Add more loaders here
      ],
    },
    resolve: {
      ...currentConfiguration.resolve,
      alias: {
        ...(currentConfiguration.resolve?.alias ?? {}),
        "~": path.join(process.cwd(), "src"),
      },
    },
  });
});

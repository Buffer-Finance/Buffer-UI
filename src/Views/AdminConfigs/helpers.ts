export const raw2adminConfig = (
  rawConfigs: typeof group2configs,
  marketConfig: marketType[] | null,
  activeChain: Chain
): AdminConfig | null => {
  const appDefaults =
    appConfig[(activeChain.id + '') as keyof typeof appConfig];
  let configObject = {};
  if (!marketConfig?.length) return null;

  for (const [group, configs] of Object.entries(rawConfigs)) {
    for (const config in configs) {
      const getterSignatre = group2abi[group].find(
        (a) => a.name == configs[config as keyof typeof configs].getter
      );
      const getter = getterSignatre
        ? {
            name: getterSignatre.name,
            ip: getterSignatre.inputs.map((ip) => ({
              name: ip.name,
              type: ip.type,
              value: '',
            })),
          }
        : null;
      const setterSignature = group2abi[group].find((a) => a.name == config);

      const setter = setterSignature
        ? {
            name: setterSignature.name,
            ip: setterSignature.inputs.map((ip) => ({
              name: ip.name,
              type: ip.type,
              value: '',
            })),
          }
        : null;
      if (marketDependent.includes(group as keyof typeof rawConfigs)) {
        for (let market of marketConfig) {
          for (const pool of market.pools) {
            const currObject: UIConfigValue = {
              contract:
                market[
                  group2marketAddresesMapping[
                    group as keyof typeof rawConfigs
                  ] as keyof (typeof marketConfig)[0]
                ],
              group,
              getter,
              setter,
              market,
            };
            if (configObject?.[group]) {
              configObject[group].push(currObject);
            } else {
              configObject[group] = [currObject];
            }
          }
        }
      } else if (group == 'pool') {
        // here

        const pools = Object.keys(appDefaults.poolsInfo);
        configObject[group] = pools.map((p) => ({
          contract: p,
          getter,
          setter,
          group,
        }));

        // configObject[group] = {
      } else {
        configObject[group] = {
          contract: appDefaults[group],
          getter,
          setter,
          group,
        };
      }
    }
  }

  return configObject;
};

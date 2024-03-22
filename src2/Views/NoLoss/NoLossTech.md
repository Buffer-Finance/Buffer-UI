## Data Flow

useNoLossStaticConfig() [static] contains all the static contract addresses such as multicall, router

useNoLossConfig() [non-revalidating] contains all the markets config, optionsContract, configContract, isPaused and all.

useNoLossTournament() [non-revalidating] contains tournament ids of all the upcoming, ongoing, closed tournaments

useTournamentData() [revalidating] contains t_id2t_info mapping.

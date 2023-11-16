import { useToast } from '@Contexts/Toast';
import { gt, lt } from '@Utils/NumString/stringArithmatics';
import { useAtomValue } from 'jotai';
import { useCallback } from 'react';
import {
  LeaderboardRulesAtom,
  TournamentConditionsAtom,
  TournamentMetaDataAtom,
} from '../../Atoms/Form';
import { getTournamentType } from './SubmitButton';

export const useFormConditions = () => {
  const leaderboardRules = useAtomValue(LeaderboardRulesAtom);
  const tournamentConditions = useAtomValue(TournamentConditionsAtom);
  const tournamentMetaData = useAtomValue(TournamentMetaDataAtom);
  const toastify = useToast();

  function validateTournamentMetaData() {
    if (!tournamentMetaData.name) {
      toastify({
        type: 'error',
        msg: 'Tournament name is required',
        id: 'tournament-metadata-validations',
      });
      return false;
    }
    if (!tournamentMetaData.startTime) {
      toastify({
        type: 'error',
        msg: 'Tournament start time is required',
        id: 'tournament-metadata-validations',
      });
      return false;
    }
    if (!tournamentMetaData.closeTime) {
      toastify({
        type: 'error',
        msg: 'Tournament close time is required',
        id: 'tournament-metadata-validations',
      });
      return false;
    }
    if (!tournamentMetaData.ticketCost) {
      toastify({
        type: 'error',
        msg: 'Tournament ticket cost is required',
        id: 'tournament-metadata-validations',
      });
      return false;
    }
    if (!tournamentMetaData.playTokenMintAmount) {
      toastify({
        type: 'error',
        msg: 'Tournament play token mint amount is required',
        id: 'tournament-metadata-validations',
      });
      return false;
    }
    if (!tournamentMetaData.buyInToken) {
      toastify({
        type: 'error',
        msg: 'Tournament buy in token is required',
        id: 'tournament-metadata-validations',
      });
      return false;
    }
    if (!tournamentMetaData.rewardToken) {
      toastify({
        type: 'error',
        msg: 'Tournament reward token is required',
        id: 'tournament-metadata-validations',
      });
      return false;
    }
    // if (!tournamentMetaData.creator) {
    //   toastify({
    //     type: 'error',
    //     msg: 'Tournament creator is required',
    //     id: 'tournament-metadata-validations',
    //   });
    //   return false;
    // }
    return true;
  }

  function validateTournamentConditions() {
    if (!tournamentConditions.maxBuyinsPerWallet) {
      toastify({
        type: 'error',
        msg: 'Tournament max buyins per wallet is required',
        id: 'tournament-conditions-validations',
      });
      return false;
    }
    if (!tournamentConditions.minParticipants) {
      toastify({
        type: 'error',
        msg: 'Tournament min participants is required',
        id: 'tournament-conditions-validations',
      });
      return false;
    }
    if (!tournamentConditions.maxParticipants) {
      toastify({
        type: 'error',
        msg: 'Tournament max participants is required',
        id: 'tournament-conditions-validations',
      });
      return false;
    }
    if (!tournamentConditions.guaranteedWinningAmount) {
      toastify({
        type: 'error',
        msg: 'Tournament guaranteed winning amount is required',
        id: 'tournament-conditions-validations',
      });
      return false;
    }
    if (!tournamentConditions.startPriceMoney) {
      toastify({
        type: 'error',
        msg: 'Tournament start price money is required',
        id: 'tournament-conditions-validations',
      });
      return false;
    }

    if (!tournamentMetaData.buyInToken) {
      toastify({
        type: 'error',
        msg: 'Fill in Tournament buy token in token in the step 1',
        id: 'tournament-metadata-validations',
      });
      return false;
    }
    if (!tournamentMetaData.rewardToken) {
      toastify({
        type: 'error',
        msg: 'Fill inTournament reward token in the step 2',
        id: 'tournament-metadata-validations',
      });
      return false;
    }
    const tournamenttype = getTournamentType(
      tournamentMetaData.buyInToken,
      tournamentMetaData.rewardToken,
      tournamentConditions.guaranteedWinningAmount
    );
    if (!tournamentConditions.rakePercent) {
      toastify({
        type: 'error',
        msg: 'Tournament rake percent is required',
        id: 'tournament-conditions-validations',
      });
      return false;
    }
    if (isNaN(+tournamentConditions.rakePercent)) {
      toastify({
        type: 'error',
        msg: 'Tournament rake percent should be a number',
        id: 'tournament-conditions-validations',
      });
      return false;
    }
    if (lt(tournamentConditions.rakePercent, '0')) {
      toastify({
        type: 'error',
        msg: 'Tournament rake percent should be greater than 0',
        id: 'tournament-conditions-validations',
      });
      return false;
    }
    if (gt(tournamentConditions.rakePercent, '100')) {
      toastify({
        type: 'error',
        msg: 'Tournament rake percent should be less than 100',
        id: 'tournament-conditions-validations',
      });
      return false;
    }
    if (tournamenttype === 0 && tournamentConditions.rakePercent !== '100') {
      toastify({
        type: 'error',
        msg: 'Tournament rake percent should be 100',
        id: 'tournament-conditions-validations',
      });
      return false;
    }
    console.log(tournamenttype, 'tournamenttype');
    if (tournamenttype === 2 && tournamentConditions.rakePercent === '100') {
      toastify({
        type: 'error',
        msg: 'Tournament rake percent should be less than 100',
        id: 'tournament-conditions-validations',
      });
      return false;
    }

    return true;
  }

  function validateLeaderboardRules() {
    // if (!leaderboardRules.userCount) {
    //   toastify({
    //     type: 'error',
    //     msg: 'Tournament user count is required',
    //     id: 'leaderboard-rules-validations',
    //   });
    //   return false;
    // }
    // if (!leaderboardRules.totalBuyins) {
    //   toastify({
    //     type: 'error',
    //     msg: 'Tournament total buyins is required',
    //     id: 'leaderboard-rules-validations',
    //   });
    //   return false;
    // }
    // if (!leaderboardRules.rakeCollected) {
    //   toastify({
    //     type: 'error',
    //     msg: 'Tournament rake collected is required',
    //     id: 'leaderboard-rules-validations',
    //   });
    //   return false;
    // }
    if (!leaderboardRules.totalWinners) {
      toastify({
        type: 'error',
        msg: 'Tournament total winners is required',
        id: 'leaderboard-rules-validations',
      });
      return false;
    }
    if (!leaderboardRules.rewardPercentages) {
      toastify({
        type: 'error',
        msg: 'Tournament reward percentages is required',
        id: 'leaderboard-rules-validations',
      });
      return false;
    }
    return true;
  }

  return useCallback(
    (formIndex: number) => {
      switch (formIndex) {
        case 0:
          return validateTournamentMetaData();
        case 1:
          return validateTournamentConditions();
        case 2:
          return validateLeaderboardRules();
        default:
          return toastify({
            type: 'error',
            msg: 'Invalid form id',
            id: 'form-validations',
          });
      }
    },
    [leaderboardRules, tournamentConditions, tournamentMetaData]
  );
};

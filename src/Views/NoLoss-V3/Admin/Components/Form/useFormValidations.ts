import { useToast } from '@Contexts/Toast';
import { useAtomValue } from 'jotai';
import { useCallback } from 'react';
import {
  LeaderboardRulesAtom,
  TournamentConditionsAtom,
  TournamentMetaDataAtom,
} from '../../Atoms/Form';

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
    if (!tournamentMetaData.creator) {
      toastify({
        type: 'error',
        msg: 'Tournament creator is required',
        id: 'tournament-metadata-validations',
      });
      return false;
    }
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
    if (!tournamentConditions.rakePercent) {
      toastify({
        type: 'error',
        msg: 'Tournament rake percent is required',
        id: 'tournament-conditions-validations',
      });
      return false;
    }
    return true;
  }

  function validateLeaderboardRules() {
    if (!leaderboardRules.userCount) {
      toastify({
        type: 'error',
        msg: 'Tournament user count is required',
        id: 'leaderboard-rules-validations',
      });
      return false;
    }
    if (!leaderboardRules.totalBuyins) {
      toastify({
        type: 'error',
        msg: 'Tournament total buyins is required',
        id: 'leaderboard-rules-validations',
      });
      return false;
    }
    if (!leaderboardRules.rakeCollected) {
      toastify({
        type: 'error',
        msg: 'Tournament rake collected is required',
        id: 'leaderboard-rules-validations',
      });
      return false;
    }
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

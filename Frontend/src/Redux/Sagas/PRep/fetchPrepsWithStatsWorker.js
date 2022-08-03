import { put, call, select } from 'redux-saga/effects';
import {
  fetchPrepsWithStatsSuccess,
  fetchPrepsWithStatsFailure,
} from '../../Reducers/prepsSlice';
import { callKeyStoreWallet } from '../../ICON/utils';

function* fetchPrepsWithStatsWorker({ payload }) {
  try {
    const preps = yield call(callKeyStoreWallet, {
      method: 'get_PReps',
    });

    const getAddress = state => state.account.address;
    const walletAddress = yield select(getAddress);

    let result = preps.map((prep, i) => {
      return { i, prep };
    });

    for (let i = 0; i < preps.length; i++) {
      const prep = preps[i];
      const remainingProposal = yield call(callKeyStoreWallet, {
        method: 'get_remaining_project',
        params: {
          _wallet_address: prep.address,
          _project_type: 'proposal',
        },
      });

      const remainingPR = yield call(callKeyStoreWallet, {
        method: 'get_remaining_project',
        params: {
          _wallet_address: prep.address,
          _project_type: 'progress_report',
        },
      });

      const priorityVoting = yield call(callKeyStoreWallet, {
        method: 'checkPriorityVoting',
        params: {
          _prep: prep.address,
        },
      });
      result[i].proposalRemaining = remainingProposal.length;
      result[i].progressReportRemaining = remainingPR.length;
      result[i].priorityVoting = priorityVoting;
    }
    yield put(fetchPrepsWithStatsSuccess(result));
  } catch (error) {
    yield put(fetchPrepsWithStatsFailure(error));
  }
}

export default fetchPrepsWithStatsWorker;

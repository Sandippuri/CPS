import { put, call} from 'redux-saga/effects';
import {fetchCPSTreasuryScoreAddressSuccess, fetchCPSTreasuryScoreAddressFailure} from '../../Reducers/fundSlice';
import {callKeyStoreWallet} from '../../ICON/utils';

function* fetchCPSTreasuryScoreAddressWorker({payload}) {
  try {

    const response = yield call(callKeyStoreWallet, {
        method: 'get_cps_treasury_score'
});

// const response = {
//     _current_block: 1000,
//     _next_block: 10000,
//     remaining_time: 86500,
//     _period_name: 'Voting Period'
// }

    yield put(fetchCPSTreasuryScoreAddressSuccess({
        response
    }));
  } catch (error) {
    yield put(fetchCPSTreasuryScoreAddressFailure(error));
  }
}

export default fetchCPSTreasuryScoreAddressWorker;
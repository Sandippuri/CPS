// import { setCookie } from '../../../helpers/cookie';
import { callKeyStoreWallet } from '../../ICON/utils';
import { put, call, select } from 'redux-saga/effects';
import { loginSuccess } from 'Redux/Reducers/accountSlice';
import { IconConverter } from 'icon-sdk-js';

export default function* loginPrepWorker() {
  try {

    const getAddress = (state) => state.account.address
    const walletAddress = yield select(getAddress);
    let response = yield call(callKeyStoreWallet, {
      method: 'login_prep',
      params: {
        _address: walletAddress,

      }
    });

    // if(payload.payload.address === 'hx215757b0edf862d2e4c10a0677b4b6944724c724') {
    //   response = '0x01';
    // }
    const isPrep = !!parseInt(IconConverter.toBigNumber(response.isPRep));
    const isRegistered = !!parseInt(IconConverter.toBigNumber(response.isRegistered));
    const payPenalty = !!parseInt(IconConverter.toBigNumber(response.payPenalty));
    const penaltyAmount = parseInt(response.penaltyAmount)


    yield put(loginSuccess({
      isPrep,
      isRegistered,
      payPenalty,
      penaltyAmount
    }));



  } catch (error) {
    console.log("error");
    // yield put(courseActions.getCourseInfoFailure());
  }
}

import * as userModel from '../model/user'

export const loadUserByBid = async ({
  type,
  bid,
}) => {
  return await userModel.loginOrRegister({
    type,
    bid,
  })
}

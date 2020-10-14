import User from '../mongoose/model/User'

export const loadUserByBid = async ({
    type,
    bid,
}) => {
    let user = await User.findOne({
        type,
        bid,
    })
    if (!user) {
        user = new User({
            type,
            bid,
        })
        await user.save()
    }
    return user
}
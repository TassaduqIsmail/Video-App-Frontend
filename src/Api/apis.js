
// const BASE_URL = 'http://192.168.18.26:3000'
// const BASE_URL = 'http://192.168.10.14:3000'
// const BASE_URL = 'http://192.168.0.101:3000'
// const BASE_URL = 'http://192.168.18.58:3000'
// const BASE_URL = 'http://192.168.18.44:3000'
// const BASE_URL = 'https://vinedo-backend-6d2023031eef.herokuapp.com'
  const BASE_URL = 'https://vinedoapp-73c4a69761e4.herokuapp.com'

// is verification false or checkpage true if isintro true
export const API = {
    USER: {
        SIGNUP: `${BASE_URL}/api/user/register`, 
        LOGIN: `${BASE_URL}/api/user/login`,
        GET_ALL_USERS: `${BASE_URL}/api/user/getAllUsers`,
        GET_USERS_BY_ID: `${BASE_URL}/api/user/getUserByUid`,
        UPDATE_IS_INTRO: `${BASE_URL}/api/user/updateStatusIntro`,
        UPDATE_PASS:`${BASE_URL}/api/user/forgotPassword`,
        Email_VERIFY:`${BASE_URL}/api/user/emailverify`,
        Deleat_User :`${BASE_URL}/api/user/updateDeletestatus`

    },
    PROFILE: {
        SET_PROFILE: `${BASE_URL}/api/userProfile/setUserProfile`,
        GET_PROFILE: `${BASE_URL}/api/userProfile/getUserProfileByUid`,
        GET_ALL_PROFILE: `${BASE_URL}/api/userProfile/getAllProfile`, 
        UPDATE_PROFILE_PIC: `${BASE_URL}/api/userProfile/updatePicById`,
        UPDATE_PROFILE_NAME: `${BASE_URL}/api/userProfile/updateNameById`,
        UPDATE_PROFILE_USERNAME: `${BASE_URL}/api/userProfile/updateUsernameById`,
        UPDATE_PROFILE_PRICE: `${BASE_URL}/api/userProfile/updatePriceById`,
    },
    IMAGE_VIDEO: {
        UPLOAD_ASSETS: `${BASE_URL}/api/userProfile/assets/upload`,
        GET_ASSETS: `${BASE_URL}/api/userProfile/assets/image_videos`,
        RATINGS: `${BASE_URL}/api/userProfile/assets/videos-ratings`,
        LIKES: `${BASE_URL}/api/userProfile/assets/videos-likes`,
        VIEWS: `${BASE_URL}/api/userProfile/assets/videos-views`,
    },
    PAYMENT: {
        SUBSCRIPTION: `${BASE_URL}/api/subcription/payment`,
        UPDATE_SUB_STATUS: `${BASE_URL}/api/subcription/updatePayment`,
        GET_SUB_STATUS: `${BASE_URL}/api/subcription/getAllSubscriber`,
        PUT_SUB_STATUS:`${BASE_URL}/api/subcription/updatePayment`,
    },
    ACCOUNT: {
        WITHDRAW_REQUEST: `${BASE_URL}/api/user/accountDetails/account`,
        GET_ALL_ACCOUNTS: `${BASE_URL}/api/user/accountDetails/getAllAccount`,
   
    }
}


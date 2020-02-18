const {session} = require('electron').remote

class BlogsUtil{

    static cookieArray = ['.CNBlogsCookie', '.Cnblogs.AspNetCore.Cookies']

    static isLogin(cookie){
        if(this.cookieArray.indexOf(cookie.name) >= 0){
            return true;
        }
    }
}

module.exports = BlogsUtil
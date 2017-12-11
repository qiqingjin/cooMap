/*
* @Author: claireyyli
* @Date:   2017-12-02 15:44:08
* @Last Modified by:   Administrator
* @Last Modified time: 2017-12-11 18:23:15
*/

var gotoUserPage = document.getElementsByClassName('gotoUserPage')[0];

gotoUserPage.addEventListener('click', function(){
    window.location.href = '/users/' + document.getElementById('inputUserName').value || 'liyueyang';
}, false);
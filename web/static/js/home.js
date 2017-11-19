const signUpTopButton = document.getElementById('index-sign-up-top')
const signUpBottomButton = document.getElementById('index-sign-up-bottom')

const redirectTo = () => () => {
  // window.location.href = destination
  alert('coming soon!')
}

signUpTopButton.addEventListener('click', redirectTo('/sign_up'))
signUpBottomButton.addEventListener('click', redirectTo('/sign_up'))
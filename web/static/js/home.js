const signUpButton = document.getElementById('index-sign-up')

const redirectTo = (destination) => () => {
  // window.location.href = destination
  alert('coming soon!')
}

signUpButton.addEventListener('click', redirectTo('/sign_up'))

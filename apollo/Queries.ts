import { gql } from "@apollo/client"

export const LOGIN_APP_USER = gql`
  mutation LoginAppUser($input: LoginUserInput!) {
    loginAppUser(input: $input) {
      success
      token
      refreshToken
    }
  }
`
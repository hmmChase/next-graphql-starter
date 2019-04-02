import { Query } from 'react-apollo';
import SignIn from './SignIn/SignIn';
import SignOut from './SignOut/SignOut';
import SignUp from './SignUp/SignUp';
import ResetRequest from './ResetRequest/ResetRequest';
import * as query from './SignOn.query';
import * as Styled from './SignOn.style';

class SignOn extends React.PureComponent {
  state = {
    showPopup: ''
  };

  render() {
    const { showPopup } = this.state;

    return (
      <Query query={query.ME_QUERY}>
        {({ data }) => (
          <Styled.div>
            {data.me ? (
              <SignOut />
            ) : (
              <>
                <Styled.aSignIn
                  onClick={() => this.setState({ showPopup: 'signIn' })}
                >
                  Sign In
                </Styled.aSignIn>
                <Styled.aSignUp
                  onClick={() => this.setState({ showPopup: 'signUp' })}
                >
                  Sign Up
                </Styled.aSignUp>
                {showPopup && (
                  <Styled.divPopup>
                    <Styled.divOuter
                      onClick={() => this.setState({ showPopup: '' })}
                    />
                    <Styled.divInner>
                      {showPopup === 'signIn' && (
                        <SignIn
                          close={() => this.setState({ showPopup: '' })}
                          resetRequest={() =>
                            this.setState({ showPopup: 'resetRequest' })
                          }
                        />
                      )}
                      {showPopup === 'signUp' && (
                        <SignUp
                          close={() => this.setState({ showPopup: '' })}
                        />
                      )}
                      {showPopup === 'resetRequest' && (
                        <ResetRequest
                          close={() => this.setState({ showPopup: '' })}
                        />
                      )}
                    </Styled.divInner>
                  </Styled.divPopup>
                )}
              </>
            )}
          </Styled.div>
        )}
      </Query>
    );
  }
}

export default SignOn;

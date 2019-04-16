/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import * as query from './SignIn.query';
import * as Styled from './SignIn.style';
import Error from '../../Error/Error';

class SignIn extends React.PureComponent {
  state = {
    email: '',
    password: ''
  };

  onChangeInput = e => this.setState({ [e.target.name]: e.target.value });

  onSubmitForm = async (e, signIn, client) => {
    e.preventDefault();
    await signIn();
    await client.resetStore();
  };

  onCompleted = () => this.props.close();

  render() {
    const { email, password } = this.state;
    const isInvalid = email === '' || password === '';

    return (
      <Mutation
        mutation={query.SIGN_IN_MUTATION}
        variables={this.state}
        onCompleted={this.onCompleted}
      >
        {(signIn, { error, loading, client }) => (
          <Styled.div>
            <form onSubmit={e => this.onSubmitForm(e, signIn, client)}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign In</h2>

                {error && <Error error={error} />}

                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={email}
                    onChange={this.onChangeInput}
                  />
                </label>

                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={password}
                    onChange={this.onChangeInput}
                  />
                </label>

                <button type="submit" disabled={isInvalid}>
                  Sign In
                </button>
              </fieldset>
            </form>

            <a style={{ cursor: 'pointer' }} onClick={this.props.requestReset}>
              Forgot password?
            </a>
          </Styled.div>
        )}
      </Mutation>
    );
  }
}

SignIn.propTypes = {
  close: PropTypes.func.isRequired,
  requestReset: PropTypes.func.isRequired
};

export default SignIn;

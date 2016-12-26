import React, {Component} from 'react';

export class Login extends Component {
  componentWillMount = () => this.props.fetchUsers()

  filterUsers = () => {
    const {search, users, logIn} = this.props;

    if (!search) {
      return [];
    }
    return Object.values(users)
      .filter((user) => new RegExp(`^${search}`).test(user.username))
      .slice(0, 9)
      .map(
        (user, i) =>
          (<li
            key={i}
            onClick={() => logIn(user.username)}
          >{user.username}</li>)
      );
  }

  render() {
    const {loggedIn, search, username, searchUsername, fetching, logOut,
           startAddingNewStock} = this.props;

    return (<div>
      {!loggedIn &&
        <form>
          <input
            type={'text'}
            name={'username'}
            value={search}
            placeholder={'Your username comes here'}
            autoComplete={'off'}
            onChange={(e) => searchUsername(e.target.value)}
          />
          {!fetching && <ul>{this.filterUsers()}</ul>}
          {fetching && <p>Loading</p>}
        </form>
      }
      {loggedIn &&
        <div>
          <p>Logged in as: {username}</p>
          <button onClick={() => logOut()}>Logout</button>
          <button onClick={() => startAddingNewStock()}>Add Stock</button>
        </div>
      }
    </div>);
  }
}

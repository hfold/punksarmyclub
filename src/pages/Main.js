import React from 'react';
import { ThemeProvider, theme, CSSReset, ToastProvider } from '@blockstack/ui';
import { userSession, authOptions } from '../common/utils/auth';
import { Connect } from '@stacks/connect-react';
import {
  UserContext
} from '../store/UserContext';

import SignedIn from './SignedIn';
import SignIn from './SignIn';


export default class Main extends React.Component {
  
  static contextType = UserContext;
  
  state = {
    user: {}
  }

  componentDidMount() {

    //console.log('ctx', this.context)
    
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(userData => {
        //console.log('userData', userData)
        window.history.replaceState({}, document.title, '/');
        
        this.setState({ user: userData });
        this.context.UserDispatch({
          type: 'update',
          obj: {
            logged: true,
            userData: userData
          }
        });

      });

    } else if (userSession.isUserSignedIn()) {
      
      let userData = userSession.loadUserData()
      //console.log('userData', userData)
      this.setState({ user: userData });
      this.context.UserDispatch({
        type: 'update',
        obj: {
          logged: true,
          userData: userData
        }
      });

    }
  }

  render() {
    return (<ThemeProvider theme={theme}>
        <Connect authOptions={authOptions}>
            <ToastProvider>
            <div className="logos_container" style={{textAlign: 'center', width: 400, margin: '10px auto'}}>
              <a className="left" href={window.DISCORD_URL} target="_blank">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAER0lEQVRoge1YXWgUVxTWirYWxZY+VK1WFPpQK7T6IFpRtCriDxKQrdWim+7cuZNNmofYPogVA1KoilZoRYIoKgq22loUf6iCbV/SIDG7984aJRqlkFAV0iANppjE7XdmNms2u3P3ziZxbZkDh/2Ze875zs8998wdNiyggAIKKKCAfBDn9SNNUy7hTO40TXGJm+IWfp8qL0+M0deReJMz8Qc3ZSvpgPwu0hkKJUYNGXDLir1BhgD4HvgJAFyxmFgHh17uXROJXJ9iGbHZliGXci5DjAmTcxHG9xLG4h+UReIzsX4cra2uTr5gGfY86DlkMvkIziTxeZ9sQG7SoAEPh2OvQOlegO4kI4j8Gcuy36X/yQFE8BuA+BXP2p3nenwHMj9BVzXAzqmoaHwN37/E/x3uc9FJNsnGgMAjkisQlZZUdH4D2NVQ/CmMXQY/9gE4H7dC337TjH8Ex76Fra6UzRbCUBB4pHuGyUSPk14magD+YDoLQ8gIUIOTcSZuu06IHsZi7/h2AGC/Tyn406n5IQae5Qj2Q9oukyd8gafNCMHuZw1awd1oAlP1o8/E7ucAdP/S2qEHHn0eAg+KDTib0b6BTcMBWVJ8sLmZMXuVRvnIH4oN1JOZPKkEX1VVO5qnD5Pnj9ER/w6H777k6QAdVMUGmY+VB5t7WBUfpLqMRI3CAdnsQ1k7Nvxmzu1FzsZn8ojOgeccUExswZC3ONUwDvs5KCHflBN8JHJtog/wd2g6zQ5AfI0KDM020VJ7cn85coRGBl37hiFfz3KAMfmhdhQAVFGGP3rWL4tv9JKjcWFA9t2RWUtBt6oTEEhP2dS7QE4HDHutvgNiT44IiJ/1FIg2LxBEmFmWech1quXEfB/74GJ2Bpi8qycseqJR+apnJJks885A4wQvOWXmsjIgmzOE6QDzs4mQwqrcMJLD4UCdQu4LLwfw7Bdd+1TGlZVNL6aF6eXFhzBxB9rggv7gaWLMU36d9L6cw+lqn/aTlpWY/jR9hr3QrwLuvC+I45zHo6Zpf449dFW3BBHt70gOwDfhd20BtpMZAfwvjBD9OWMyxRnwcZ7Uxwb5JV4nU3HlvuRifdoBZedwHWhz+7Q47WezFwj8OlpqKb7XK9cCc58Sst/n+d+B28kJy2p4C5t1H9ruX4MIuse5quFypWHYb0O/rV4vu7B2bkYvwCas0DJmimN0c+ZeMYrl+O8ADN4sAPRDgL5AdsvLE+MjkRtjoWdb/qsbzFpcMI9eLCM6tQ7j/2Dt0b6dgAYsiiD4MydD6DSI1Fl8nqc3KRqDwVvpNo+xxHuh0MkRqRY+E8+/1sko2c2o/VxE14Z56y8VCQKjVKZB+SbYPvZiAD9LS6lbHvYGCAnvTSS+Gij4tD0mtis2ax05SZfBBSl3TmmUBV3qug6hIzFxrmCFOck5xU9xuiM15e+9B130Ezlt8GwEFFBAAQX0f6R/AaHMLEsgDVfiAAAAAElFTkSuQmCC" />
              </a>
              <img className="logo_img" src="./images/logo.png" />
              <a className="right" href={window.TWITTER_URL} target="_blank">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEpElEQVRo3u3ZWWhcVRgH8N+ZSVIbm0mt2irp2EJdERRFRVzwwapgBfFBHxR644YPCiKK+CIqqA/qg6JgXcBMRRFrwYoruKDihivu1NYlN4m7NhONSZuZ68Ocao1Jk8mkSR/yh2HuMOee8//ut3+XOcxhDnOYTYSZPnDZw3+qVistWIxFkcMW/IzBNCnsngJ0lLbIyS3C6TgbR0cBYAAb8Rw2yMJ3aWdbtv3eYqkM7VhG9lmatFfGFWDJ2h+0ZK0rMoaqzXr7zi80TL5YKudwBG7GSswbZ2kVn+AGPIM8luB4dOIN3JomhX+Eaxq9Q0vWOg/XBwr5ba5AXyPkl5b64STch0Mm0HoOR+IBrMN+8XcHNuHxHcmPqYFiqbwCL2Fp3OTqSlVf34WFqT79ZXgUJzTwHPpwGdmzmdCKv3qSQmW7xKNxYHSwPM7FmnzOimLpj1A/+YEmXBFNYKroxW34jXB1YHUI/1rOWALsjZZ4nccqPEb11KVd5Xx9Z2cdOGeccya1AZpxJZ7GaXgq/bpteGcCbI037rjmGHSF4Jpiqbxfsas8WQKHR/ttJMwvxnJ8gWuFfI8bg50J0Is/x4qEMYo8ITi3WCovKpbK45pVyDfDodijwSA2En3y4kz4KF295/+8fjQ2YfM4mzXhRDyEp3BpsVReXiyNYVpNLXaI843gQ1yUqXzZk7SNSWi02f1KWB/jdtM4m+4ZBTkO3+CVYqn8Jj5FN8rYFr8bRT9+6Un2mnwmLpbKB+BJHFXHQRX8Hk2wO4a+jhgEGsn4z+GcNCkMj2cSo8nPx4+4DvfX0vekkMc+8XPkNFYhW6IfjJv5RuNM3BuzYFcssmYTA3nVip045Vj1yAVYjT92yAmzhe+/TRaqRwOfRRPKxwpw/iyS34qPTVA8jcZ3eHlUMpst/IzP6xIg7WwfxpqohdnGxzGi1aGBLJPxPm7H4CySr+BpoTpYrwnpSQrbohZuqVWBs4If8Eq6eqG6BYA0KQziDlyI12JGnEm/eDVm+akJELEPhnBXzAm/zBD533B/8/yRoYkWNk3wfzvuRjGubZ4B8hmeJbzz9XkT14ITaWAjHplB8tvbx3vSpG1oMot3KkBa6zvX4MUZsv+tuBPvTfaGCVu9kGU/xZZuQyyRd6XpPI+u+OCmR4Duznbz+tu+wiVxXrMxOvZ04wNcayRfV6Coq06PnVdH7BNOxllx1tMoNuHiILzenbTVZap1TQvSpFDJQtaNd2OdsnCayF+OusnXpYE4HlwcR4OX49hYsU4VVbWS5Sq8lSaF6lTHFmBpVzmEEHJZPlcxso2Qawq1XmDvOF04HWfgoGmYNAzjCdxUlX3Vm7RPeaOm/15nJ4ZKZaWQ2xcFtcFqEfvHRr5RVPEl1mSs7UkK/Y1uGP5rJv3NhBPUxoGnxFJiOkbwI7EsXocHyW1OkwXTklf+Ry6+gGjFYWpjwVU4GK1TeNpb4lxnPV5Ad5oURqYz9oZJOO6+ccpwvNrgd3l05rZYXuQi2eFIuA/fxtb0bXwhM5B2FuwK1JkH+nNq4+02LIjOnI/Nx6Dam5aBapYN9Xa27w4t6RzmMIc57GL8Dd3SWy0+K+3uAAAAAElFTkSuQmCC" />
              </a>
            </div>  
            <div className="site-wrapper" style={{marginBottom: 48}}>
                <div className="site-wrapper-inner">
                  {/*<Header />*/}
                  {!this.context.UserState.logged ? <SignIn /> : <SignedIn />}
                </div>
              </div>
            </ToastProvider>
            <CSSReset />
          </Connect>
      </ThemeProvider>
    );
  }
};

import promise from 'promise';
import superagent from 'superagent';
import superagent_promise from 'superagent-promise';

export default superagent_promise(superagent, promise);
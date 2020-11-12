import React from 'react';
const submit = (e) => {
    e.preventDefault()
    console.log('sss')
}
const Setup = ({search}) => {

  return <div className="btn-container">
      <form >
          <input  type="text" onInput={search}/>
          <input type="submit" value="search" onClick={submit}/>
    </form>
  </div>;
};

export default Setup;
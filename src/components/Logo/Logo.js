import React from 'react';
import Tilt from 'react-tilt';
import logo from './face-rec.png'

const Logo = () => {
	return (
		<div className='ml4 mt0'>
			<Tilt className="Tilt" options={{ max : 45 }} style={{ height: 250, width: 250 }} >
 				<div className="Tilt-inner pa3"> 
 					<img alt='logo' src={logo}/>
 				</div>
			</Tilt>
		</div>
	);
}

export default Logo;

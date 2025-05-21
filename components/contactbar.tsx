import { FaLinkedin, FaEnvelope } from 'react-icons/fa';
import ContactItem from './ContactItem';

export default function ContactBar() {
    return (
        <>
            <div className='flex flex-col items-center pb-5 font-bold'>
                Get in contact with me!
                <div className='flex gap-12 font-normal pt-3'>
                    <ContactItem 
                        link='https://www.linkedin.com/in/chanelle-jaeger-9530b12a2/' 
                        Icon={<FaLinkedin color='#2d64bc' size={20} className='absolute top-1/2 -translate-y-1/2 left-[-22px]'/>}
                        text='LinkedIn'
                        isLink={true}
                    />
                    <ContactItem 
                        link='#'
                        Icon={<FaEnvelope color='#583d81' size={20} className='absolute top-1/2 -translate-y-1/2 left-[-22px]' />}
                        text='cjaeger27@amherst.edu'
                        isLink={false}
                    />
                </div>
            </div>
        </>
    );
}

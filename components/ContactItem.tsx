interface ContactItemProps {
    link: string,
    Icon: React.ReactElement,
    text: string,
    isLink: boolean
}

export default function ContactItem({ link, Icon, text, isLink }: ContactItemProps) {
    return (
        isLink ? (
            <a href={link} target='_blank' rel='noopener noreferrer' className='relative gap-1 hover:underline'>
                {Icon} {text}
            </a>
        ) : (
            <span className='relative gap-1'>
                {Icon} {text}
            </span>
        )
        
    );
}

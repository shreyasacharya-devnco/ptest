import { StaggeredMenu } from '@/components/StaggeredMenu';

const navItems = [
  { label: 'Home',    ariaLabel: 'Go to home page',    link: '/'        },
  { label: 'Work',    ariaLabel: 'View my work',        link: '/work'    },
  { label: 'About',   ariaLabel: 'Learn about me',      link: '/about'   },
  { label: 'Contact', ariaLabel: 'Get in touch',        link: '/contact' },
  {
    label: 'Resume',
    ariaLabel: 'View resume (opens in new tab)',
    link: 'https://drive.google.com/file/d/1QUqunq_a5JA2YBqwyDzt67OCuIhWFQ15/view?usp=sharing',
    isExternal: true,
  },
];

const socialItems = [
  { label: 'LinkedIn', link: 'https://www.linkedin.com/in/om-tiwari-6b100627b', isExternal: true  },
  { label: 'Behance',  link: 'https://www.behance.net/omtiwari2',                isExternal: true  },
  { label: 'Email',    link: 'mailto:omtiwari.pune@gmail.com',                   isExternal: false },
];

export const Navigation = () => {
  return (
    <StaggeredMenu
      position="right"
      items={navItems}
      socialItems={socialItems}
      displaySocials={true}
      displayItemNumbering={true}
      logoText="Om."
      resumeUrl="/Om_Tiwari_Resume.pdf"
      isFixed={true}
      closeOnClickAway={true}
    />
  );
};

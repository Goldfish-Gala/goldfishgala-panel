const Footer = () => {
    return (
        <div className="mt-auto p-6 pt-0 text-center dark:text-white-dark ltr:sm:text-left rtl:sm:text-right">
            © {new Date().getFullYear()}. Goldfish Gala All rights reserved. <br className="md:hidden"></br>
            Powered by Grivo.id
        </div>
    );
};

export default Footer;

import Header from '../components/header';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';

const AppLayout = (props) => {
  return (
    <div className='app-layout bg-[#08153c] font-sans'>
      <div className='flex'>
        <Sidebar />
        <div className='w-full ml-8 main_body'>
          <Header/>
          {props.children}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;

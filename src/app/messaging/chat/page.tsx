// 'use client';

// import React  from 'react';
// // import { useSession } from 'next-auth/react';
// // import axios from 'axios';
// // import BannerSection from './Banner';
// // import { Button } from '@/components/elements';
// // import { DeleteIcon } from '@/icons';
// // import Image from 'next/image';

// const MessageMainPage = () => {
//   //  const { data: session, status } = useSession();
//   //  const [ setConversations] = useState([]);
//   //  const [selectedConversation, setSelectedConversation] = useState(null);
//   //  const [messages, setMessages] = useState([]);
//   //  const [loading, setLoading] = useState(true);

//   //  useEffect(() => {
//   //    if (session?.user?.id) {
//   //      fetchConversations();
//   //    }
//   //  }, [session]);

//   //  const fetchConversations = async () => {
//   //    try {
//   //      const response = await axios.get(
//   //        `${process.env.NEXT_PUBLIC_API_URL}/message/conversations/${session?.user?.id}`,
//   //        {
//   //          headers: {
//   //            Authorization: `Bearer ${session?.token}`,
//   //          },
//   //        }
//   //      );
//   //      console.log('notyfy' , response.data)
//   //      setConversations(response?.data?.conversations);
//   //    } catch (error) {
//   //      console.error('Error fetching conversations:', error);
//      }
//   //  };
// //  const fetchMessages = async (conversationId) => {
// //    try {
// //      const response = await axios.get(
// //        `/api/message/conversation/${conversationId}`,
// //        {
// //          headers: {
// //            Authorization: `Bearer ${session.token}`,
// //          },
// //        }
// //      );
// //      setMessages(response.data.messages);
// //      setSelectedConversation(conversationId);
// //    } catch (error) {
// //      console.error('Error fetching messages:', error);
// //    }
// //  };
//     // if (status === 'loading') return <p>Loading session...</p>;
//     // if (!session) return <p>Please log in to access this page.</p>;

//   return (
//     <div className="message-main-wrapper">
//       <div className="message-banner-area">
//         <BannerSection />
//       </div>
//       <div className="message-content-area pb-20">
//         <div className="custom-container">
//           <div className="message-area-wrapper pt-10 grid grid-cols-12 gap-6">
//             <div className="message-left-area sticky h-[80vh] overflow-hidden col-span-5 sm:col-span-full">
//               <div className="conversation-list-header pt-[15px]">
//                 <div className="converation-title-box flex justify-between items-center mb-4">
//                   <h2 className="eyebrow-large font-secondary text-mono-100 uppercase">
//                     Inbox
//                   </h2>
//                   <Image
//                     src="/images/edit-squer-icon.svg"
//                     alt="edit icons"
//                     width={24}
//                     height={24}
//                     className="w-6 h-6"
//                   />
//                 </div>
//                 <div className="converation-search-box mb-4">
//                   <form
//                     action=""
//                     method="get"
//                     className="conversation-message-search"
//                   >
//                     <label htmlFor="searchMessage" className="relative">
//                       <input
//                         type="search"
//                         name="search"
//                         id="searchMessage"
//                         placeholder="Search Message"
//                         className="pl-10 h-9 !bg-[#F6F8FA]  w-full text-mono-100 placeholder:!text-[#CDD3DA] body-bold-small"
//                       />
//                       <span className="search-icon absolute top-1 left-4 bottom-0 my-auto">
//                         <Image
//                           src="/images/search.svg"
//                           alt="search icons"
//                           width={16}
//                           height={16}
//                           className="w-4 h-4"
//                         />
//                       </span>
//                     </label>
//                   </form>
//                 </div>
//                 <div className="converation-filter-box mb-6"></div>
//               </div>
//               <ul className="conversation-lists pr-3 overflow-hidden h-[460px] overflow-y-scroll">
//                 {/* {conversations.map(conv => (
//                   <li
//                     className="conversation-list-item flex items-center hover:bg-[#F1F1F7] cursor-pointer h-[72px] py-2 pl-[17px] pr-[10px] mb-2"
//                     key={conv.conversationId}
//                   >
//                     <div>
//                       <strong>
//                         {conv.participants
//                           .filter(p => p.participantId !== conv.currentUserId)
//                           .map(p => p.firstName || p.charityName)
//                           .join(', ')}
//                       </strong>
//                       <p>{conv.lastMessage}</p>
//                     </div>
//                     <div className="conversation-item-cont flex gap-[27px] items-center">
//                       <div className="user-image">
//                         <Image
//                           src="/images/icons/elisp-profile-default-img.svg"
//                           alt="user profile image"
//                           className="min-w-10 max-w-10 min-h-10 max-h-10 object-cover rounded-full"
//                           width={320}
//                           height={480}
//                         />
//                       </div>
//                       <div className="user-info">
//                         <p className="name  forms-bold text-mono-100">
//                           Username 1
//                         </p>
//                         <p className="content  forms-bold text-mono-50">
//                           Hey, I am still awaiting my parcel. Please can I get
//                           an update on this, as it has now been two days...
//                         </p>
//                       </div>
//                     </div>
//                     <div className="item-action h-full flex flex-col items-end justify-between">
//                       <Button variant="accend-link" className="delete-btn !p-0">
//                         <DeleteIcon />
//                       </Button>
//                       <span className="time-temps whitespace-nowrap forms-bold text-mono-50">
//                         4h Ago
//                       </span>
//                     </div>
//                   </li>
//                 ))} */}
//                 <li className="conversation-list-item flex items-center hover:bg-[#F1F1F7] cursor-pointer h-[72px] py-2 pl-[17px] pr-[10px] mb-2">
//                   <div className="conversation-item-cont flex gap-[27px] items-center">
//                     <div className="user-image">
//                       <Image
//                         src="/images/icons/elisp-profile-default-img.svg"
//                         alt="user profile image"
//                         className="min-w-10 max-w-10 min-h-10 max-h-10 object-cover rounded-full"
//                         width={320}
//                         height={480}
//                       />
//                     </div>
//                     <div className="user-info">
//                       <p className="name  forms-bold text-mono-100">
//                         Username 1
//                       </p>
//                       <p className="content  forms-bold text-mono-50">
//                         Hey, I am still awaiting my parcel. Please can I get an
//                         update on this, as it has now been two days...
//                       </p>
//                     </div>
//                   </div>
//                   <div className="item-action h-full flex flex-col items-end justify-between">
//                     <Button variant="accend-link" className="delete-btn !p-0">
//                       <DeleteIcon />
//                     </Button>
//                     <span className="time-temps whitespace-nowrap forms-bold text-mono-50">
//                       4h Ago
//                     </span>
//                   </div>
//                 </li>
//                 <li className="conversation-list-item flex items-center hover:bg-[#F1F1F7] cursor-pointer h-[72px] py-2 pl-[17px] pr-[10px] mb-2">
//                   <div className="conversation-item-cont flex gap-[27px] items-center">
//                     <div className="user-image">
//                       <Image
//                         src="/images/icons/elisp-profile-default-img.svg"
//                         alt="user profile image"
//                         className="min-w-10 max-w-10 min-h-10 max-h-10 object-cover rounded-full"
//                         width={320}
//                         height={480}
//                       />
//                     </div>
//                     <div className="user-info">
//                       <p className="name  forms-bold text-mono-100">
//                         Username 1
//                       </p>
//                       <p className="content  forms-bold text-mono-50">
//                         Hey, I am still awaiting my parcel. Please can I get an
//                         update on this, as it has now been two days...
//                       </p>
//                     </div>
//                   </div>
//                   <div className="item-action h-full flex flex-col items-end justify-between">
//                     <Button variant="accend-link" className="delete-btn !p-0">
//                       <DeleteIcon />
//                     </Button>
//                     <span className="time-temps whitespace-nowrap forms-bold text-mono-50">
//                       4h Ago
//                     </span>
//                   </div>
//                 </li>
//                 <li className="conversation-list-item flex items-center hover:bg-[#F1F1F7] cursor-pointer h-[72px] py-2 pl-[17px] pr-[10px] mb-2">
//                   <div className="conversation-item-cont flex gap-[27px] items-center">
//                     <div className="user-image">
//                       <Image
//                         src="/images/icons/elisp-profile-default-img.svg"
//                         alt="user profile image"
//                         className="min-w-10 max-w-10 min-h-10 max-h-10 object-cover rounded-full"
//                         width={320}
//                         height={480}
//                       />
//                     </div>
//                     <div className="user-info">
//                       <p className="name  forms-bold text-mono-100">
//                         Username 1
//                       </p>
//                       <p className="content  forms-bold text-mono-50">
//                         Hey, I am still awaiting my parcel. Please can I get an
//                         update on this, as it has now been two days...
//                       </p>
//                     </div>
//                   </div>
//                   <div className="item-action h-full flex flex-col items-end justify-between">
//                     <Button variant="accend-link" className="delete-btn !p-0">
//                       <DeleteIcon />
//                     </Button>
//                     <span className="time-temps whitespace-nowrap forms-bold text-mono-50">
//                       4h Ago
//                     </span>
//                   </div>
//                 </li>
//               </ul>
//             </div>
//             <div className="message-right-area col-span-7 sm:col-span-full">
//               <div className="message-main-content-wrapper h-full w-full pt-[17px] pb-[22px] px-12">
//                 <Image
//                   src="/images/logo-message.svg"
//                   alt="message area brand logo"
//                   width={111}
//                   height={35}
//                   className="w-[111px] h-34px] mx-auto mb-6"
//                 />
//                 <div className="chat-conversion-area">
//                   <div className="conversion-sessions">
//                     <div className="conversion-session-time">
//                       {/* per 24 hour it take new date with conversion */}
//                       <p className="time-temps-per-day text-center eyebrow-small text-mono-90 uppercase mb-6">
//                         TUESDAY 29TH OCTOBER
//                       </p>
//                     </div>
//                     <div className="recipient-message mb-6">
//                       <div className="user-info flex items-center gap-[11px]">
//                         <div className="user-image">
//                           <Image
//                             src="/images/icons/elisp-profile-default-img.svg"
//                             alt="mes-user-img"
//                             width={24}
//                             height={24}
//                             className="w-6 h-6 object-cover"
//                           />
//                         </div>
//                         <div className="user-info flex items-center gap-2">
//                           <p className="name forms-bold text-mono-100">
//                             Username 1
//                           </p>
//                           <p className="msg-time forms-bold text-mono-70">
//                             05:00pm
//                           </p>
//                         </div>
//                       </div>
//                       <div className="message-cont-box pl-[35px]">
//                         <p className="message-content pt-[15px] text-mono-100 forms-bold pr-[26px] pb-7 pl-[25px]">
//                           Lorem ipsum dolor sit amet, consectetur adipiscing
//                           elit, sed do eiusmod tempor incididunt ut labore et
//                           dolore magna aliqua. Ut enim ad minim veniam, quis
//                           nostrud exercitation ullamco laboris nisi ut aliquip
//                           ex ea commodo consequat. Duis aute irure dolor in
//                           reprehenderit in voluptate velit esse cillum dolore eu
//                           fugiat nulla pariatur. Excepteur sint occaecat
//                           cupidatat non proident, sunt in culpa qui officia
//                           deserunt mollit anim id est laborum.
//                         </p>
//                       </div>
//                     </div>
//                     <div className="sender-message  mb-6">
//                       <div className="user-info flex items-center w-full flex-row-reverse gap-[11px]">
//                         <div className="user-image">
//                           <Image
//                             src="/images/icons/elisp-profile-default-img.svg"
//                             alt="mes-user-img"
//                             width={24}
//                             height={24}
//                             className="w-6 h-6 object-cover"
//                           />
//                         </div>
//                         <div className="user-info flex flex-row-reverse items-center gap-2">
//                           <p className="name forms-bold text-mono-100">you</p>
//                           <p className="msg-time forms-bold text-mono-70">
//                             05:00pm
//                           </p>
//                         </div>
//                       </div>
//                       <div className="message-cont-box pr-[35px]">
//                         <p className="message-content pt-[15px] text-mono-100 forms-bold pr-[26px] pb-7 pl-[25px] bg-[#F6F8FA]">
//                           Lorem ipsum dolor sit amet, consectetur adipiscing
//                           elit, sed do eiusmod tempor incididunt ut labore et
//                           dolore magna aliqua. Ut enim ad minim veniam, quis
//                           nostrud exercitation ullamco laboris nisi ut aliquip
//                           ex ea commodo consequat. Duis aute irure dolor in
//                           reprehenderit in voluptate velit esse cillum dolore eu
//                           fugiat nulla pariatur. Excepteur sint occaecat
//                           cupidatat non proident, sunt in culpa qui officia
//                           deserunt mollit anim id est laborum.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="message-input-are relative mt-auto">
//                   <input
//                     type="text"
//                     // value={message}
//                     // onChange={e => setMessage(e.target.value)}
//                     placeholder="Write your message..."
//                     className="pl-[17px] py-2 body-bold-small text-mono-100 placeholder:text-[#CDD3DA] h-9 w-full pr-10 bg-[#F6F8FA] rounded-[24px]"
//                   />
//                   <Button
//                     // onClick={handleSend}
//                     variant="accend-link"
//                     className="h-9 absolute top-0 right-0 bottom-0 my-auto"
//                   >
//                     <Image
//                       src="/images/Send.svg"
//                       alt="send icon image"
//                       className="w-[17px] h-[18px] text-mono-70"
//                       width={17}
//                       height={18}
//                     />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessageMainPage;
import React from 'react'

const MessagePage = () => {
  return (
    <div>
      
    </div>
  )
}

export default MessagePage

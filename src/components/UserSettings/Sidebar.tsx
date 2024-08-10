"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
import React from "react";

function SidebarItem(props: {
  children: React.ReactNode;
  path: string;
  href: string;
  margin?: boolean;
}) {
  const active = props.path === props.href;
  // console.log(`props.children: ${props.children?.toString()}`)
  return (
    <div className="">
      <Link
        href={props.href}
        className={clsx({
          "hover:font-bold": true,
          // "hover:text-red-800 dark:hover:text-sciquelMuted2": true,
          // "text-red-800 dark:text-sciquelMuted2": active,
          "font-bold": active,
          // "bg-[#FFF]": active, idk why that doesn't work lol
          "md:mt-16": props.margin,
        })}
      >
        {props.children}
      </Link>
    </div>
  );
}

export default function Sidebar() {
  // 📝: this is the code for the sidebar! a couple of things to note: this huge, commented-out portion of this code was an attempt to make the
  //     sidebar collapsible (as according to the figma). it's a v low priority task, but if edward ever wants to re-implement it, you can
  //     reference this. also, bug the design team abt giving you a proper `svg` for the setting item...

  const path: string = usePathname();
  const temp = path.split("/");
  temp[temp.length - 1]
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toUpperCase() : word.toLowerCase();
    })
    .replace(/-/g, " ");

  /*
  const [xPressed, setXPressed] = useState(false);
  const [side, setSide] = useState<JSX.Element | null>(null);

  useEffect(() => {
    let currSide;

    console.log(`made it into useEffect()`)

    if (!xPressed) {
      currSide = (
        <div>
          <div className="pt-3 font-semibold flex flex-row-reverse"
          onClick={(() => {setXPressed(true)})}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2L2 13.7098" stroke="#1A6768" stroke-width="3" stroke-linecap="round"/>
            <path d="M14 13.71L2.00006 2.00007" stroke="#1A6768" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>

          <div className="flex flex-col justify-between text-[#1A6768] text-xl h-4/5">
            <div>
              <SidebarItem href="/user-settings/dashboard" path={path}>
                <div className="flex flex-row items-center my-3">
                  <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.2038 12.9367C20.727 12.9367 21.1552 13.3615 21.1133 13.8831C20.965 15.7278 20.3851 17.5082 19.4212 19.0561C18.2932 20.8675 16.6899 22.2793 14.8141 23.113C12.9383 23.9467 10.8743 24.1648 8.88295 23.7398C6.89163 23.3148 5.06249 22.2657 3.62683 20.7253C2.19116 19.1848 1.21347 17.2222 0.817367 15.0855C0.421268 12.9489 0.62456 10.7342 1.40154 8.72148C2.17851 6.70879 3.49427 4.98852 5.18243 3.7782C6.60726 2.75668 8.24335 2.13715 9.93981 1.96872C10.4605 1.91703 10.8857 2.34603 10.8857 2.86926V11.9893C10.8857 12.5125 11.3098 12.9367 11.833 12.9367H20.2038Z" fill="#1A6768"/>
                    <path d="M12.5966 1.71009C12.5966 1.18687 13.0215 0.758564 13.5429 0.802578C14.6415 0.895327 15.721 1.14923 16.7433 1.55703C18.058 2.08144 19.2525 2.85008 20.2587 3.81907C21.2649 4.78805 22.0631 5.9384 22.6076 7.20444C23.0265 8.1782 23.289 9.20573 23.3878 10.2518C23.4371 10.7727 23.0083 11.1978 22.4851 11.1978L13.544 11.1978C13.0208 11.1978 12.5966 10.7736 12.5966 10.2504L12.5966 1.71009Z" fill="#1A6768"/>
                  </svg>

                  Dashboard
                </div>
              </SidebarItem>

              <hr className="solid my-2 border-[#D6D6D6]"></hr>

              <SidebarItem href="/user-settings/reading-history" path={path}>
                <div className="flex flex-row items-center my-3">
                  <svg className="mr-2" width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.33326" y="0.692636" width="21.4212" height="18.3195" rx="2.57778" stroke="#1A6768" stroke-width="1.39113"/>
                    <rect x="4.05957" y="4.63477" width="15.9686" height="1.1602" rx="0.5801" fill="#1A6768"/>
                    <rect x="4.05957" y="6.95312" width="5.70308" height="1.1602" rx="0.5801" fill="#1A6768"/>
                    <rect x="10.9033" y="6.95312" width="9.12493" height="1.1602" rx="0.5801" fill="#1A6768"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.37715 15.8712C7.2467 15.8584 7.11929 15.794 7.01947 15.6781L5.54617 13.9662C5.32185 13.7055 5.32185 13.2829 5.54617 13.0223C5.77049 12.7616 6.13419 12.7616 6.35851 13.0223L7.67811 14.5556L11.058 10.6283C11.2836 10.3661 11.6495 10.3661 11.8751 10.6283C12.1007 10.8904 12.1007 11.3155 11.8751 11.5777L8.18706 15.863C7.9638 16.1224 7.6033 16.1251 7.37715 15.8712Z" fill="#1A6768"/>
                    <rect width="7.34313" height="1.33179" rx="0.665897" transform="matrix(0.701293 -0.712873 0.701293 0.712873 13.1846 15.666)" fill="#1A6768"/>
                    <rect width="7.34313" height="1.33179" rx="0.665897" transform="matrix(0.701293 0.712873 -0.701293 0.712873 14.1182 10.4316)" fill="#1A6768"/>
                  </svg>

                  Reading History
                </div>
              </SidebarItem>

              <hr className="solid my-2 border-[#D6D6D6]"></hr>

              <SidebarItem href="/user-settings/activity" path={path}>
                <div className="flex flex-row items-center my-3">
                  <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C8.68629 4 6 6.68629 6 10C6 12.1239 7.49449 13.6844 8.61273 14.5418C9.38769 15.136 10 16.0839 10 17.1998V18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18V17.1998C8 16.8387 7.79298 16.4335 7.39578 16.129C6.14463 15.1696 4 13.091 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10C20 13.091 17.8554 15.1696 16.6042 16.129C16.207 16.4335 16 16.8387 16 17.1998V18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18V17.1998C14 16.0839 14.6123 15.136 15.3873 14.5418C16.5055 13.6844 18 12.1239 18 10C18 6.68629 15.3137 4 12 4Z" fill="#1A6768"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 18C8 17.4477 8.44772 17 9 17H15C15.5523 17 16 17.4477 16 18C16 18.5523 15.5523 19 15 19H9C8.44772 19 8 18.5523 8 18Z" fill="#1A6768"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 21C8 20.4477 8.44772 20 9 20H15C15.5523 20 16 20.4477 16 21C16 21.5523 15.5523 22 15 22H9C8.44772 22 8 21.5523 8 21Z" fill="#1A6768"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9 10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10C15 10.5523 14.5523 11 14 11H10C9.44772 11 9 10.5523 9 10Z" fill="#1A6768"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 9C12.5523 9 13 9.44772 13 10V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V10C11 9.44772 11.4477 9 12 9Z" fill="#1A6768"/>
                  </svg>

                  Activity
                </div>
              </SidebarItem>

              <hr className="solid my-2 border-[#D6D6D6]"></hr>

              <SidebarItem href="/user-settings/quiz-history" path={path}>
                <div className="flex flex-row items-center my-3">
                  <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.5C12.3788 2.5 12.7251 2.714 12.8945 3.05279L15.4734 8.2106L21.144 9.03541C21.5206 9.0902 21.8335 9.35402 21.9511 9.71599C22.0687 10.078 21.9706 10.4753 21.6981 10.741L17.571 14.7649L18.4994 20.4385C18.5608 20.8135 18.4043 21.1908 18.0957 21.4124C17.787 21.6339 17.3794 21.6614 17.0438 21.4834L12 18.8071L6.95624 21.4834C6.62062 21.6614 6.21306 21.6339 5.9044 21.4124C5.59573 21.1908 5.4393 20.8135 5.50065 20.4385L6.42906 14.7649L2.30193 10.741C2.02942 10.4753 1.93136 10.078 2.04897 9.71599C2.16658 9.35402 2.47946 9.0902 2.85609 9.03541L8.5267 8.2106L11.1056 3.05279C11.275 2.714 11.6213 2.5 12 2.5ZM12 5.73607L10.082 9.57221C9.93561 9.86491 9.65531 10.0675 9.33147 10.1146L5.14842 10.723L8.19813 13.6965C8.43182 13.9243 8.53961 14.2519 8.4869 14.574L7.80004 18.7715L11.5313 16.7917C11.8244 16.6361 12.1756 16.6361 12.4687 16.7917L16.2 18.7715L15.5132 14.574C15.4604 14.2519 15.5682 13.9243 15.8019 13.6965L18.8516 10.723L14.6686 10.1146C14.3448 10.0675 14.0645 9.86491 13.9181 9.57221L12 5.73607Z" fill="#1A6768"/>
                  </svg>

                  Quiz History
                </div>
              </SidebarItem>

              <hr className="solid my-2 border-[#D6D6D6]"></hr>

              <SidebarItem href="/user-settings/annotations" path={path}>
                <div className="flex flex-row items-center my-3">
                  <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3 7C3 5.89543 3.89543 5 5 5H10C10.5523 5 11 5.44772 11 6C11 6.55228 10.5523 7 10 7H5V19H17V14C17 13.4477 17.4477 13 18 13C18.5523 13 19 13.4477 19 14V19C19 20.1046 18.1046 21 17 21H5C3.89543 21 3 20.1046 3 19V7Z" fill="#1A6768"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2929 3.29289C16.6834 2.90237 17.3166 2.90237 17.7071 3.29289L20.7071 6.29289C21.0976 6.68342 21.0976 7.31658 20.7071 7.70711L11.7071 16.7071C11.5196 16.8946 11.2652 17 11 17H8C7.44772 17 7 16.5523 7 16V13C7 12.7348 7.10536 12.4804 7.29289 12.2929L16.2929 3.29289ZM9 13.4142V15H10.5858L18.5858 7L17 5.41421L9 13.4142Z" fill="#1A6768"/>
                  </svg>

                  Annotations
                </div>
              </SidebarItem>

              <hr className="solid my-2 border-[#D6D6D6]"></hr>

              <SidebarItem href="/user-settings/comments" path={path}>
                <div className="flex flex-row items-center my-3">
                  <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5 4C4.73478 4 4.48043 4.10536 4.29289 4.29289C4.10536 4.48043 4 4.73478 4 5V18.5858L6.29289 16.2929C6.48043 16.1054 6.73478 16 7 16H19C19.2652 16 19.5196 15.8946 19.7071 15.7071C19.8946 15.5196 20 15.2652 20 15V5C20 4.73478 19.8946 4.48043 19.7071 4.29289C19.5196 4.10536 19.2652 4 19 4H5ZM2.87868 2.87868C3.44129 2.31607 4.20435 2 5 2H19C19.7957 2 20.5587 2.31607 21.1213 2.87868C21.6839 3.44129 22 4.20435 22 5V15C22 15.7957 21.6839 16.5587 21.1213 17.1213C20.5587 17.6839 19.7957 18 19 18H7.41421L3.70711 21.7071C3.42111 21.9931 2.99099 22.0787 2.61732 21.9239C2.24364 21.7691 2 21.4045 2 21V5C2 4.20435 2.31607 3.44129 2.87868 2.87868Z" fill="#1A6768"/>
                  </svg>

                  Comments
                </div>
              </SidebarItem>

              <hr className="solid my-2 border-[#D6D6D6]"></hr>

            </div>
            
            <div>
              <SidebarItem href="/user-settings/contact-us" path={path} margin={true}>
                <div className="flex flex-row items-center my-3"> 
                  <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.032 14.88C18.1701 14.3453 18.7155 14.0237 19.2502 14.1618C20.3229 14.4387 21.2732 15.0641 21.9519 15.9397C22.6307 16.8152 22.9994 17.8914 23.0002 18.9993V21C23.0002 21.5523 22.5525 22 22.0002 22C21.448 22 21.0002 21.5523 21.0002 21V19.0007C20.9997 18.3361 20.7784 17.6902 20.3713 17.165C19.964 16.6396 19.3938 16.2644 18.7502 16.0982C18.2155 15.9602 17.8939 15.4148 18.032 14.88Z" fill="#1A6768"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0315 2.88196C14.1685 2.34694 14.7133 2.02426 15.2483 2.16125C16.3238 2.43663 17.2771 3.06213 17.9578 3.93914C18.6386 4.81615 19.0081 5.89479 19.0081 7.005C19.0081 8.11521 18.6386 9.19385 17.9578 10.0709C17.2771 10.9479 16.3238 11.5734 15.2483 11.8488C14.7133 11.9857 14.1685 11.6631 14.0315 11.128C13.8945 10.593 14.2172 10.0482 14.7522 9.91125C15.3975 9.74603 15.9695 9.37073 16.3779 8.84452C16.7864 8.31831 17.0081 7.67113 17.0081 7.005C17.0081 6.33887 16.7864 5.69169 16.3779 5.16548C15.9695 4.63928 15.3975 4.26398 14.7522 4.09875C14.2172 3.96176 13.8945 3.41699 14.0315 2.88196Z" fill="#1A6768"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9 4C7.34315 4 6 5.34315 6 7C6 8.65685 7.34315 10 9 10C10.6569 10 12 8.65685 12 7C12 5.34315 10.6569 4 9 4ZM4 7C4 4.23858 6.23858 2 9 2C11.7614 2 14 4.23858 14 7C14 9.76142 11.7614 12 9 12C6.23858 12 4 9.76142 4 7Z" fill="#1A6768"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6 16C4.34315 16 3 17.3431 3 19V21C3 21.5523 2.55228 22 2 22C1.44772 22 1 21.5523 1 21V19C1 16.2386 3.23858 14 6 14H12C14.7614 14 17 16.2386 17 19V21C17 21.5523 16.5523 22 16 22C15.4477 22 15 21.5523 15 21V19C15 17.3431 13.6569 16 12 16H6Z" fill="#1A6768"/>
                  </svg>

                  Contact Us
                </div>
              </SidebarItem>

              <SidebarItem href="/user-settings/settings" path={path}>
                <div className="flex flex-row items-center my-3"> 
                  <svg className="mr-1" width="30" height="30" viewBox="0 0 24 24" fill="#1A6768" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#1A6768" d="M19.2 10L18.1 9.8C18 9.6 18 9.4 17.9 9.2L18.5 8.3L19 7.6L16.4 5L15.7 5.5L14.8 6.1C14.6 6 14.4 6 14.2 5.9L14 4.8L13.8 4H10.2L10 4.8L9.8 5.9C9.6 6 9.4 6 9.2 6.1L8.3 5.5L7.6 5.1L5.1 7.6L5.6 8.3L6.2 9.2C6 9.4 6 9.6 5.9 9.8L4.8 10L4 10.2V13.8L4.8 14L5.9 14.2C6 14.4 6 14.6 6.1 14.8L5.5 15.7L5 16.4L7.6 19L8.3 18.5L9.2 17.9C9.4 18 9.6 18 9.8 18.1L10 19.2L10.2 20H13.8L14 19.2L14.2 18.1C14.4 18 14.6 18 14.8 17.9L15.7 18.5L16.4 19L19 16.4L18.5 15.7L17.9 14.8C18 14.6 18.1 14.4 18.1 14.2L19.2 14L20 13.8V10.2L19.2 10ZM19 13L17.3 13.3C17.2 13.8 17 14.3 16.7 14.8L17.6 16.2L16.2 17.6L14.8 16.7C14.3 17 13.8 17.2 13.3 17.3L13 19H11L10.7 17.3C10.2 17.2 9.7 17 9.2 16.7L7.8 17.6L6.4 16.2L7.3 14.8C7 14.3 6.8 13.8 6.7 13.3L5 13V11L6.7 10.7C6.8 10.2 7 9.7 7.3 9.2L6.3 7.8L7.7 6.4L9.1 7.3C9.6 7 10.1 6.8 10.6 6.7L11 5H13L13.3 6.7C13.8 6.8 14.3 7 14.8 7.3L16.2 6.4L17.6 7.8L16.7 9.2C17 9.7 17.2 10.2 17.3 10.7L19 11V13Z"/>
                    <path fill="#1A6768" d="M12 8.5C10.1 8.5 8.5 10.1 8.5 12C8.5 13.9 10.1 15.5 12 15.5C13.9 15.5 15.5 13.9 15.5 12C15.5 10.1 13.9 8.5 12 8.5ZM12 14.5C10.6 14.5 9.5 13.4 9.5 12C9.5 10.6 10.6 9.5 12 9.5C13.4 9.5 14.5 10.6 14.5 12C14.5 13.4 13.4 14.5 12 14.5Z"/>
                  </svg>

                    Settings
                  </div>
                  </SidebarItem>
                </div>
          </div>
        </div>
        
      )
    } else { // collapsed, a.k.a. x pressed
      console.log(`made it into xPressed == true!`)
      
      currSide = (
        <p>hiiii i'm ur sign this is working 🫶</p>
        // <div>
        //   <div className="pt-3 font-semibold flex flex-row-reverse"
        //   onClick={(() => {setXPressed(false)})}>
        //     <svg width="12" height="19" viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        //     <path d="M9.95996 9.44531L2.00036 16.7102" stroke="#1A6768" stroke-width="3" stroke-linecap="round"/>
        //     <path d="M2 2L10 9.22597" stroke="#1A6768" stroke-width="3" stroke-linecap="round"/>
        //     </svg>
        //   </div>

        //   <div className="flex flex-col justify-between text-[#1A6768] text-xl h-4/5">
        //   <div>
        //     <SidebarItem href="/user-settings/dashboard" path={path}>
        //       <div className="flex flex-row items-center my-3">
        //         <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        //           <path d="M20.2038 12.9367C20.727 12.9367 21.1552 13.3615 21.1133 13.8831C20.965 15.7278 20.3851 17.5082 19.4212 19.0561C18.2932 20.8675 16.6899 22.2793 14.8141 23.113C12.9383 23.9467 10.8743 24.1648 8.88295 23.7398C6.89163 23.3148 5.06249 22.2657 3.62683 20.7253C2.19116 19.1848 1.21347 17.2222 0.817367 15.0855C0.421268 12.9489 0.62456 10.7342 1.40154 8.72148C2.17851 6.70879 3.49427 4.98852 5.18243 3.7782C6.60726 2.75668 8.24335 2.13715 9.93981 1.96872C10.4605 1.91703 10.8857 2.34603 10.8857 2.86926V11.9893C10.8857 12.5125 11.3098 12.9367 11.833 12.9367H20.2038Z" fill="#1A6768"/>
        //           <path d="M12.5966 1.71009C12.5966 1.18687 13.0215 0.758564 13.5429 0.802578C14.6415 0.895327 15.721 1.14923 16.7433 1.55703C18.058 2.08144 19.2525 2.85008 20.2587 3.81907C21.2649 4.78805 22.0631 5.9384 22.6076 7.20444C23.0265 8.1782 23.289 9.20573 23.3878 10.2518C23.4371 10.7727 23.0083 11.1978 22.4851 11.1978L13.544 11.1978C13.0208 11.1978 12.5966 10.7736 12.5966 10.2504L12.5966 1.71009Z" fill="#1A6768"/>
        //         </svg>
        //       </div>
        //     </SidebarItem>

        //     <hr className="solid my-2 border-[#D6D6D6]"></hr>

        //     <SidebarItem href="/user-settings/reading-history" path={path}>
        //       <div className="flex flex-row items-center my-3">
        //         <svg className="mr-2" width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        //           <rect x="1.33326" y="0.692636" width="21.4212" height="18.3195" rx="2.57778" stroke="#1A6768" stroke-width="1.39113"/>
        //           <rect x="4.05957" y="4.63477" width="15.9686" height="1.1602" rx="0.5801" fill="#1A6768"/>
        //           <rect x="4.05957" y="6.95312" width="5.70308" height="1.1602" rx="0.5801" fill="#1A6768"/>
        //           <rect x="10.9033" y="6.95312" width="9.12493" height="1.1602" rx="0.5801" fill="#1A6768"/>
        //           <path fill-rule="evenodd" clip-rule="evenodd" d="M7.37715 15.8712C7.2467 15.8584 7.11929 15.794 7.01947 15.6781L5.54617 13.9662C5.32185 13.7055 5.32185 13.2829 5.54617 13.0223C5.77049 12.7616 6.13419 12.7616 6.35851 13.0223L7.67811 14.5556L11.058 10.6283C11.2836 10.3661 11.6495 10.3661 11.8751 10.6283C12.1007 10.8904 12.1007 11.3155 11.8751 11.5777L8.18706 15.863C7.9638 16.1224 7.6033 16.1251 7.37715 15.8712Z" fill="#1A6768"/>
        //           <rect width="7.34313" height="1.33179" rx="0.665897" transform="matrix(0.701293 -0.712873 0.701293 0.712873 13.1846 15.666)" fill="#1A6768"/>
        //           <rect width="7.34313" height="1.33179" rx="0.665897" transform="matrix(0.701293 0.712873 -0.701293 0.712873 14.1182 10.4316)" fill="#1A6768"/>
        //         </svg>
        //       </div>
        //     </SidebarItem>

        //     <hr className="solid my-2 border-[#D6D6D6]"></hr>

        //     <SidebarItem href="/user-settings/activity" path={path}>
        //       <div className="flex flex-row items-center my-3">
        //         <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        //           <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C8.68629 4 6 6.68629 6 10C6 12.1239 7.49449 13.6844 8.61273 14.5418C9.38769 15.136 10 16.0839 10 17.1998V18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18V17.1998C8 16.8387 7.79298 16.4335 7.39578 16.129C6.14463 15.1696 4 13.091 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10C20 13.091 17.8554 15.1696 16.6042 16.129C16.207 16.4335 16 16.8387 16 17.1998V18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18V17.1998C14 16.0839 14.6123 15.136 15.3873 14.5418C16.5055 13.6844 18 12.1239 18 10C18 6.68629 15.3137 4 12 4Z" fill="#1A6768"/>
        //           <path fill-rule="evenodd" clip-rule="evenodd" d="M8 18C8 17.4477 8.44772 17 9 17H15C15.5523 17 16 17.4477 16 18C16 18.5523 15.5523 19 15 19H9C8.44772 19 8 18.5523 8 18Z" fill="#1A6768"/>
        //           <path fill-rule="evenodd" clip-rule="evenodd" d="M8 21C8 20.4477 8.44772 20 9 20H15C15.5523 20 16 20.4477 16 21C16 21.5523 15.5523 22 15 22H9C8.44772 22 8 21.5523 8 21Z" fill="#1A6768"/>
        //           <path fill-rule="evenodd" clip-rule="evenodd" d="M9 10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10C15 10.5523 14.5523 11 14 11H10C9.44772 11 9 10.5523 9 10Z" fill="#1A6768"/>
        //           <path fill-rule="evenodd" clip-rule="evenodd" d="M12 9C12.5523 9 13 9.44772 13 10V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V10C11 9.44772 11.4477 9 12 9Z" fill="#1A6768"/>
        //         </svg>
        //       </div>
        //     </SidebarItem>

        //     <hr className="solid my-2 border-[#D6D6D6]"></hr>

        //     <SidebarItem href="/user-settings/quiz-history" path={path}>
        //       <div className="flex flex-row items-center my-3">
        //         <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        //           <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.5C12.3788 2.5 12.7251 2.714 12.8945 3.05279L15.4734 8.2106L21.144 9.03541C21.5206 9.0902 21.8335 9.35402 21.9511 9.71599C22.0687 10.078 21.9706 10.4753 21.6981 10.741L17.571 14.7649L18.4994 20.4385C18.5608 20.8135 18.4043 21.1908 18.0957 21.4124C17.787 21.6339 17.3794 21.6614 17.0438 21.4834L12 18.8071L6.95624 21.4834C6.62062 21.6614 6.21306 21.6339 5.9044 21.4124C5.59573 21.1908 5.4393 20.8135 5.50065 20.4385L6.42906 14.7649L2.30193 10.741C2.02942 10.4753 1.93136 10.078 2.04897 9.71599C2.16658 9.35402 2.47946 9.0902 2.85609 9.03541L8.5267 8.2106L11.1056 3.05279C11.275 2.714 11.6213 2.5 12 2.5ZM12 5.73607L10.082 9.57221C9.93561 9.86491 9.65531 10.0675 9.33147 10.1146L5.14842 10.723L8.19813 13.6965C8.43182 13.9243 8.53961 14.2519 8.4869 14.574L7.80004 18.7715L11.5313 16.7917C11.8244 16.6361 12.1756 16.6361 12.4687 16.7917L16.2 18.7715L15.5132 14.574C15.4604 14.2519 15.5682 13.9243 15.8019 13.6965L18.8516 10.723L14.6686 10.1146C14.3448 10.0675 14.0645 9.86491 13.9181 9.57221L12 5.73607Z" fill="#1A6768"/>
        //         </svg>
        //       </div>
        //     </SidebarItem>

        //     <hr className="solid my-2 border-[#D6D6D6]"></hr>

        //     <SidebarItem href="/user-settings/annotations" path={path}>
        //       <div className="flex flex-row items-center my-3">
        //         <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        //           <path fill-rule="evenodd" clip-rule="evenodd" d="M3 7C3 5.89543 3.89543 5 5 5H10C10.5523 5 11 5.44772 11 6C11 6.55228 10.5523 7 10 7H5V19H17V14C17 13.4477 17.4477 13 18 13C18.5523 13 19 13.4477 19 14V19C19 20.1046 18.1046 21 17 21H5C3.89543 21 3 20.1046 3 19V7Z" fill="#1A6768"/>
        //           <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2929 3.29289C16.6834 2.90237 17.3166 2.90237 17.7071 3.29289L20.7071 6.29289C21.0976 6.68342 21.0976 7.31658 20.7071 7.70711L11.7071 16.7071C11.5196 16.8946 11.2652 17 11 17H8C7.44772 17 7 16.5523 7 16V13C7 12.7348 7.10536 12.4804 7.29289 12.2929L16.2929 3.29289ZM9 13.4142V15H10.5858L18.5858 7L17 5.41421L9 13.4142Z" fill="#1A6768"/>
        //         </svg>
        //       </div>
        //     </SidebarItem>

        //     <hr className="solid my-2 border-[#D6D6D6]"></hr>

        //     <SidebarItem href="/user-settings/comments" path={path}>
        //       <div className="flex flex-row items-center my-3">
        //         <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        //           <path fill-rule="evenodd" clip-rule="evenodd" d="M5 4C4.73478 4 4.48043 4.10536 4.29289 4.29289C4.10536 4.48043 4 4.73478 4 5V18.5858L6.29289 16.2929C6.48043 16.1054 6.73478 16 7 16H19C19.2652 16 19.5196 15.8946 19.7071 15.7071C19.8946 15.5196 20 15.2652 20 15V5C20 4.73478 19.8946 4.48043 19.7071 4.29289C19.5196 4.10536 19.2652 4 19 4H5ZM2.87868 2.87868C3.44129 2.31607 4.20435 2 5 2H19C19.7957 2 20.5587 2.31607 21.1213 2.87868C21.6839 3.44129 22 4.20435 22 5V15C22 15.7957 21.6839 16.5587 21.1213 17.1213C20.5587 17.6839 19.7957 18 19 18H7.41421L3.70711 21.7071C3.42111 21.9931 2.99099 22.0787 2.61732 21.9239C2.24364 21.7691 2 21.4045 2 21V5C2 4.20435 2.31607 3.44129 2.87868 2.87868Z" fill="#1A6768"/>
        //         </svg>
        //       </div>
        //     </SidebarItem>

        //     <hr className="solid my-2 border-[#D6D6D6]"></hr>

        //   </div>
          
        //   <div>
        //     <SidebarItem href="/user-settings/contact-us" path={path} margin={true}>
        //       <div className="flex flex-row items-center my-3"> 
        //         <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        //           <path fill-rule="evenodd" clip-rule="evenodd" d="M18.032 14.88C18.1701 14.3453 18.7155 14.0237 19.2502 14.1618C20.3229 14.4387 21.2732 15.0641 21.9519 15.9397C22.6307 16.8152 22.9994 17.8914 23.0002 18.9993V21C23.0002 21.5523 22.5525 22 22.0002 22C21.448 22 21.0002 21.5523 21.0002 21V19.0007C20.9997 18.3361 20.7784 17.6902 20.3713 17.165C19.964 16.6396 19.3938 16.2644 18.7502 16.0982C18.2155 15.9602 17.8939 15.4148 18.032 14.88Z" fill="#1A6768"/>
        //           <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0315 2.88196C14.1685 2.34694 14.7133 2.02426 15.2483 2.16125C16.3238 2.43663 17.2771 3.06213 17.9578 3.93914C18.6386 4.81615 19.0081 5.89479 19.0081 7.005C19.0081 8.11521 18.6386 9.19385 17.9578 10.0709C17.2771 10.9479 16.3238 11.5734 15.2483 11.8488C14.7133 11.9857 14.1685 11.6631 14.0315 11.128C13.8945 10.593 14.2172 10.0482 14.7522 9.91125C15.3975 9.74603 15.9695 9.37073 16.3779 8.84452C16.7864 8.31831 17.0081 7.67113 17.0081 7.005C17.0081 6.33887 16.7864 5.69169 16.3779 5.16548C15.9695 4.63928 15.3975 4.26398 14.7522 4.09875C14.2172 3.96176 13.8945 3.41699 14.0315 2.88196Z" fill="#1A6768"/>
        //           <path fill-rule="evenodd" clip-rule="evenodd" d="M9 4C7.34315 4 6 5.34315 6 7C6 8.65685 7.34315 10 9 10C10.6569 10 12 8.65685 12 7C12 5.34315 10.6569 4 9 4ZM4 7C4 4.23858 6.23858 2 9 2C11.7614 2 14 4.23858 14 7C14 9.76142 11.7614 12 9 12C6.23858 12 4 9.76142 4 7Z" fill="#1A6768"/>
        //           <path fill-rule="evenodd" clip-rule="evenodd" d="M6 16C4.34315 16 3 17.3431 3 19V21C3 21.5523 2.55228 22 2 22C1.44772 22 1 21.5523 1 21V19C1 16.2386 3.23858 14 6 14H12C14.7614 14 17 16.2386 17 19V21C17 21.5523 16.5523 22 16 22C15.4477 22 15 21.5523 15 21V19C15 17.3431 13.6569 16 12 16H6Z" fill="#1A6768"/>
        //         </svg>
        //       </div>
        //     </SidebarItem>

        //     <SidebarItem href="/user-settings/settings" path={path}>
        //       ⚙️
        //     </SidebarItem>
        //   </div>
        // </div>
        // </div>
      )
    }

    setSide(currSide)
    console.log(currSide)

  }, [xPressed]);

  */
  return (
    <div>
      <div
        className="z-10 h-screen gap-4 gap-y-8 bg-[#EDF4F4] px-5 pt-1.5 pt-6 text-center text-xl dark:text-white md:sticky md:w-56 
                md:flex-col md:gap-y-2 md:text-left"
      >
        <div className="flex h-4/5 flex-col justify-between text-xl text-[#1A6768]">
          <div>
            <SidebarItem href="/user-settings/dashboard" path={path}>
              <div className="my-3 flex flex-row items-center">
                {/* N.B.: bc i didn't know this, it might be helpful-- these svg codes are directly copied from figma! just right click and select 'copy as svg'*/}
                <svg
                  className="mr-2"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.2038 12.9367C20.727 12.9367 21.1552 13.3615 21.1133 13.8831C20.965 15.7278 20.3851 17.5082 19.4212 19.0561C18.2932 20.8675 16.6899 22.2793 14.8141 23.113C12.9383 23.9467 10.8743 24.1648 8.88295 23.7398C6.89163 23.3148 5.06249 22.2657 3.62683 20.7253C2.19116 19.1848 1.21347 17.2222 0.817367 15.0855C0.421268 12.9489 0.62456 10.7342 1.40154 8.72148C2.17851 6.70879 3.49427 4.98852 5.18243 3.7782C6.60726 2.75668 8.24335 2.13715 9.93981 1.96872C10.4605 1.91703 10.8857 2.34603 10.8857 2.86926V11.9893C10.8857 12.5125 11.3098 12.9367 11.833 12.9367H20.2038Z"
                    fill="#1A6768"
                  />
                  <path
                    d="M12.5966 1.71009C12.5966 1.18687 13.0215 0.758564 13.5429 0.802578C14.6415 0.895327 15.721 1.14923 16.7433 1.55703C18.058 2.08144 19.2525 2.85008 20.2587 3.81907C21.2649 4.78805 22.0631 5.9384 22.6076 7.20444C23.0265 8.1782 23.289 9.20573 23.3878 10.2518C23.4371 10.7727 23.0083 11.1978 22.4851 11.1978L13.544 11.1978C13.0208 11.1978 12.5966 10.7736 12.5966 10.2504L12.5966 1.71009Z"
                    fill="#1A6768"
                  />
                </svg>
                Dashboard
              </div>
            </SidebarItem>

            <hr className="solid my-2 border-[#D6D6D6]"></hr>

            <SidebarItem href="/user-settings/reading-history" path={path}>
              <div className="my-3 flex flex-row items-center">
                <svg
                  className="mr-2"
                  width="24"
                  height="20"
                  viewBox="0 0 24 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1.33326"
                    y="0.692636"
                    width="21.4212"
                    height="18.3195"
                    rx="2.57778"
                    stroke="#1A6768"
                    stroke-width="1.39113"
                  />
                  <rect
                    x="4.05957"
                    y="4.63477"
                    width="15.9686"
                    height="1.1602"
                    rx="0.5801"
                    fill="#1A6768"
                  />
                  <rect
                    x="4.05957"
                    y="6.95312"
                    width="5.70308"
                    height="1.1602"
                    rx="0.5801"
                    fill="#1A6768"
                  />
                  <rect
                    x="10.9033"
                    y="6.95312"
                    width="9.12493"
                    height="1.1602"
                    rx="0.5801"
                    fill="#1A6768"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.37715 15.8712C7.2467 15.8584 7.11929 15.794 7.01947 15.6781L5.54617 13.9662C5.32185 13.7055 5.32185 13.2829 5.54617 13.0223C5.77049 12.7616 6.13419 12.7616 6.35851 13.0223L7.67811 14.5556L11.058 10.6283C11.2836 10.3661 11.6495 10.3661 11.8751 10.6283C12.1007 10.8904 12.1007 11.3155 11.8751 11.5777L8.18706 15.863C7.9638 16.1224 7.6033 16.1251 7.37715 15.8712Z"
                    fill="#1A6768"
                  />
                  <rect
                    width="7.34313"
                    height="1.33179"
                    rx="0.665897"
                    transform="matrix(0.701293 -0.712873 0.701293 0.712873 13.1846 15.666)"
                    fill="#1A6768"
                  />
                  <rect
                    width="7.34313"
                    height="1.33179"
                    rx="0.665897"
                    transform="matrix(0.701293 0.712873 -0.701293 0.712873 14.1182 10.4316)"
                    fill="#1A6768"
                  />
                </svg>
                Reading History
              </div>
            </SidebarItem>

            <hr className="solid my-2 border-[#D6D6D6]"></hr>

            <SidebarItem href="/user-settings/activity" path={path}>
              <div className="my-3 flex flex-row items-center">
                <svg
                  className="mr-2"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 4C8.68629 4 6 6.68629 6 10C6 12.1239 7.49449 13.6844 8.61273 14.5418C9.38769 15.136 10 16.0839 10 17.1998V18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18V17.1998C8 16.8387 7.79298 16.4335 7.39578 16.129C6.14463 15.1696 4 13.091 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10C20 13.091 17.8554 15.1696 16.6042 16.129C16.207 16.4335 16 16.8387 16 17.1998V18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18V17.1998C14 16.0839 14.6123 15.136 15.3873 14.5418C16.5055 13.6844 18 12.1239 18 10C18 6.68629 15.3137 4 12 4Z"
                    fill="#1A6768"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8 18C8 17.4477 8.44772 17 9 17H15C15.5523 17 16 17.4477 16 18C16 18.5523 15.5523 19 15 19H9C8.44772 19 8 18.5523 8 18Z"
                    fill="#1A6768"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8 21C8 20.4477 8.44772 20 9 20H15C15.5523 20 16 20.4477 16 21C16 21.5523 15.5523 22 15 22H9C8.44772 22 8 21.5523 8 21Z"
                    fill="#1A6768"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9 10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10C15 10.5523 14.5523 11 14 11H10C9.44772 11 9 10.5523 9 10Z"
                    fill="#1A6768"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 9C12.5523 9 13 9.44772 13 10V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V10C11 9.44772 11.4477 9 12 9Z"
                    fill="#1A6768"
                  />
                </svg>
                Activity
              </div>
            </SidebarItem>

            <hr className="solid my-2 border-[#D6D6D6]"></hr>

            <SidebarItem href="/user-settings/quiz-history" path={path}>
              <div className="my-3 flex flex-row items-center">
                <svg
                  className="mr-2"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 2.5C12.3788 2.5 12.7251 2.714 12.8945 3.05279L15.4734 8.2106L21.144 9.03541C21.5206 9.0902 21.8335 9.35402 21.9511 9.71599C22.0687 10.078 21.9706 10.4753 21.6981 10.741L17.571 14.7649L18.4994 20.4385C18.5608 20.8135 18.4043 21.1908 18.0957 21.4124C17.787 21.6339 17.3794 21.6614 17.0438 21.4834L12 18.8071L6.95624 21.4834C6.62062 21.6614 6.21306 21.6339 5.9044 21.4124C5.59573 21.1908 5.4393 20.8135 5.50065 20.4385L6.42906 14.7649L2.30193 10.741C2.02942 10.4753 1.93136 10.078 2.04897 9.71599C2.16658 9.35402 2.47946 9.0902 2.85609 9.03541L8.5267 8.2106L11.1056 3.05279C11.275 2.714 11.6213 2.5 12 2.5ZM12 5.73607L10.082 9.57221C9.93561 9.86491 9.65531 10.0675 9.33147 10.1146L5.14842 10.723L8.19813 13.6965C8.43182 13.9243 8.53961 14.2519 8.4869 14.574L7.80004 18.7715L11.5313 16.7917C11.8244 16.6361 12.1756 16.6361 12.4687 16.7917L16.2 18.7715L15.5132 14.574C15.4604 14.2519 15.5682 13.9243 15.8019 13.6965L18.8516 10.723L14.6686 10.1146C14.3448 10.0675 14.0645 9.86491 13.9181 9.57221L12 5.73607Z"
                    fill="#1A6768"
                  />
                </svg>
                Quiz History
              </div>
            </SidebarItem>

            <hr className="solid my-2 border-[#D6D6D6]"></hr>

            <SidebarItem href="/user-settings/annotations" path={path}>
              <div className="my-3 flex flex-row items-center">
                <svg
                  className="mr-2"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3 7C3 5.89543 3.89543 5 5 5H10C10.5523 5 11 5.44772 11 6C11 6.55228 10.5523 7 10 7H5V19H17V14C17 13.4477 17.4477 13 18 13C18.5523 13 19 13.4477 19 14V19C19 20.1046 18.1046 21 17 21H5C3.89543 21 3 20.1046 3 19V7Z"
                    fill="#1A6768"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16.2929 3.29289C16.6834 2.90237 17.3166 2.90237 17.7071 3.29289L20.7071 6.29289C21.0976 6.68342 21.0976 7.31658 20.7071 7.70711L11.7071 16.7071C11.5196 16.8946 11.2652 17 11 17H8C7.44772 17 7 16.5523 7 16V13C7 12.7348 7.10536 12.4804 7.29289 12.2929L16.2929 3.29289ZM9 13.4142V15H10.5858L18.5858 7L17 5.41421L9 13.4142Z"
                    fill="#1A6768"
                  />
                </svg>
                Annotations
              </div>
            </SidebarItem>

            <hr className="solid my-2 border-[#D6D6D6]"></hr>

            <SidebarItem href="/user-settings/comments" path={path}>
              <div className="my-3 flex flex-row items-center">
                <svg
                  className="mr-2"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5 4C4.73478 4 4.48043 4.10536 4.29289 4.29289C4.10536 4.48043 4 4.73478 4 5V18.5858L6.29289 16.2929C6.48043 16.1054 6.73478 16 7 16H19C19.2652 16 19.5196 15.8946 19.7071 15.7071C19.8946 15.5196 20 15.2652 20 15V5C20 4.73478 19.8946 4.48043 19.7071 4.29289C19.5196 4.10536 19.2652 4 19 4H5ZM2.87868 2.87868C3.44129 2.31607 4.20435 2 5 2H19C19.7957 2 20.5587 2.31607 21.1213 2.87868C21.6839 3.44129 22 4.20435 22 5V15C22 15.7957 21.6839 16.5587 21.1213 17.1213C20.5587 17.6839 19.7957 18 19 18H7.41421L3.70711 21.7071C3.42111 21.9931 2.99099 22.0787 2.61732 21.9239C2.24364 21.7691 2 21.4045 2 21V5C2 4.20435 2.31607 3.44129 2.87868 2.87868Z"
                    fill="#1A6768"
                  />
                </svg>
                Comments
              </div>
            </SidebarItem>

            <hr className="solid my-2 border-[#D6D6D6]"></hr>
          </div>

          <div>
            <SidebarItem
              href="/user-settings/contact-us"
              path={path}
              margin={true}
            >
              <div className="my-3 flex flex-row items-center">
                <svg
                  className="mr-2"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.032 14.88C18.1701 14.3453 18.7155 14.0237 19.2502 14.1618C20.3229 14.4387 21.2732 15.0641 21.9519 15.9397C22.6307 16.8152 22.9994 17.8914 23.0002 18.9993V21C23.0002 21.5523 22.5525 22 22.0002 22C21.448 22 21.0002 21.5523 21.0002 21V19.0007C20.9997 18.3361 20.7784 17.6902 20.3713 17.165C19.964 16.6396 19.3938 16.2644 18.7502 16.0982C18.2155 15.9602 17.8939 15.4148 18.032 14.88Z"
                    fill="#1A6768"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.0315 2.88196C14.1685 2.34694 14.7133 2.02426 15.2483 2.16125C16.3238 2.43663 17.2771 3.06213 17.9578 3.93914C18.6386 4.81615 19.0081 5.89479 19.0081 7.005C19.0081 8.11521 18.6386 9.19385 17.9578 10.0709C17.2771 10.9479 16.3238 11.5734 15.2483 11.8488C14.7133 11.9857 14.1685 11.6631 14.0315 11.128C13.8945 10.593 14.2172 10.0482 14.7522 9.91125C15.3975 9.74603 15.9695 9.37073 16.3779 8.84452C16.7864 8.31831 17.0081 7.67113 17.0081 7.005C17.0081 6.33887 16.7864 5.69169 16.3779 5.16548C15.9695 4.63928 15.3975 4.26398 14.7522 4.09875C14.2172 3.96176 13.8945 3.41699 14.0315 2.88196Z"
                    fill="#1A6768"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9 4C7.34315 4 6 5.34315 6 7C6 8.65685 7.34315 10 9 10C10.6569 10 12 8.65685 12 7C12 5.34315 10.6569 4 9 4ZM4 7C4 4.23858 6.23858 2 9 2C11.7614 2 14 4.23858 14 7C14 9.76142 11.7614 12 9 12C6.23858 12 4 9.76142 4 7Z"
                    fill="#1A6768"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6 16C4.34315 16 3 17.3431 3 19V21C3 21.5523 2.55228 22 2 22C1.44772 22 1 21.5523 1 21V19C1 16.2386 3.23858 14 6 14H12C14.7614 14 17 16.2386 17 19V21C17 21.5523 16.5523 22 16 22C15.4477 22 15 21.5523 15 21V19C15 17.3431 13.6569 16 12 16H6Z"
                    fill="#1A6768"
                  />
                </svg>
                Contact Us
              </div>
            </SidebarItem>

            <SidebarItem href="/user-settings/settings" path={path}>
              <div className="my-3 flex flex-row items-center">
                <svg
                  width="33"
                  height="33"
                  viewBox="0 0 24 24"
                  fill="#1A6768"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#1A6768"
                    d="M19.2 10L18.1 9.8C18 9.6 18 9.4 17.9 9.2L18.5 8.3L19 7.6L16.4 5L15.7 5.5L14.8 6.1C14.6 6 14.4 6 14.2 5.9L14 4.8L13.8 4H10.2L10 4.8L9.8 5.9C9.6 6 9.4 6 9.2 6.1L8.3 5.5L7.6 5.1L5.1 7.6L5.6 8.3L6.2 9.2C6 9.4 6 9.6 5.9 9.8L4.8 10L4 10.2V13.8L4.8 14L5.9 14.2C6 14.4 6 14.6 6.1 14.8L5.5 15.7L5 16.4L7.6 19L8.3 18.5L9.2 17.9C9.4 18 9.6 18 9.8 18.1L10 19.2L10.2 20H13.8L14 19.2L14.2 18.1C14.4 18 14.6 18 14.8 17.9L15.7 18.5L16.4 19L19 16.4L18.5 15.7L17.9 14.8C18 14.6 18.1 14.4 18.1 14.2L19.2 14L20 13.8V10.2L19.2 10ZM19 13L17.3 13.3C17.2 13.8 17 14.3 16.7 14.8L17.6 16.2L16.2 17.6L14.8 16.7C14.3 17 13.8 17.2 13.3 17.3L13 19H11L10.7 17.3C10.2 17.2 9.7 17 9.2 16.7L7.8 17.6L6.4 16.2L7.3 14.8C7 14.3 6.8 13.8 6.7 13.3L5 13V11L6.7 10.7C6.8 10.2 7 9.7 7.3 9.2L6.3 7.8L7.7 6.4L9.1 7.3C9.6 7 10.1 6.8 10.6 6.7L11 5H13L13.3 6.7C13.8 6.8 14.3 7 14.8 7.3L16.2 6.4L17.6 7.8L16.7 9.2C17 9.7 17.2 10.2 17.3 10.7L19 11V13Z"
                  />
                  <path
                    fill="#1A6768"
                    d="M12 8.5C10.1 8.5 8.5 10.1 8.5 12C8.5 13.9 10.1 15.5 12 15.5C13.9 15.5 15.5 13.9 15.5 12C15.5 10.1 13.9 8.5 12 8.5ZM12 14.5C10.6 14.5 9.5 13.4 9.5 12C9.5 10.6 10.6 9.5 12 9.5C13.4 9.5 14.5 10.6 14.5 12C14.5 13.4 13.4 14.5 12 14.5Z"
                  />
                </svg>
                Settings
              </div>
            </SidebarItem>
          </div>
        </div>
      </div>
    </div>
  );
}

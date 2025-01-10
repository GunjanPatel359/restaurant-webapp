"use client"

import { getUserInfo } from '@/actions/user';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("blue")
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        async function themeSetUp(){
            try{
                const res=await getUserInfo()
                if(res.user?.colors){
                    setTheme(res.user?.colors)
                }
            }catch(e){
                console.log(e)
            }finally{
                setLoading(false)
            }
        }
        themeSetUp()
    },[])

    // if(!theme){
    //     <div>
            
    //     </div>
    // }

    return (
        <ThemeContext.Provider value={{ theme, setTheme}}>
            <div className={`transition-all duration-500 theme-${theme}`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}

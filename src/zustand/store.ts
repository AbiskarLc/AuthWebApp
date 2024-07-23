import {create} from "zustand";
import {persist} from 'zustand/middleware'
 

 
type UserStore = {
    users: FormData[];
    setUsers: (users: FormData[]) => void;
  };
 
const useUserStore = create(
    persist(
        (set) =>({
            users:[],
            setUsers: (users: UserStore) => set({users})
        }),
        {
            name: 'users-storage',
            getStorage: () => localStorage,
        }
    )
)
 
export default useUserStore;
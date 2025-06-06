import { defineStore } from "pinia";
import type { RoomInfo } from "./type_struct";

export const roomInfoStore = defineStore('roomInfoStore', {
  state: () => ({
    roomInfo: [] as RoomInfo[],
  }),
  actions: {
    setRoomInfo(roomInfo: RoomInfo[]) { this.roomInfo = roomInfo },
    getRoomInfo(): RoomInfo[] {
      return this.roomInfo;
    }
  },
})


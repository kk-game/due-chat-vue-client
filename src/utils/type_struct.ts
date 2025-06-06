
export class UserInfo {
  constructor(
    public uid: string,
    public nickname: string,
  ) { }
}

export class Creater {
  constructor(
    public user: UserInfo,
    public timestamp: number,
  ) { }
}

export class RoomInfo {
  constructor(
    public id: string,
    public name: string,
    public creator: string,
    public desc: string,
    public image: string,
    public online: number,
  ) { }
}


export interface SingleRoomInfo {
  id: string,
  name: string,
  creator: string,
  desc: string,
  image: string,
  online: number,
}

type LoginRequest = {
  username: string;
  password: string;
}

type SongRequest = {
  title: string;
  penyanyi: string;
}

type SoapEndpoint = {
  url: string;
  template: string;
  headers: object;
}

export { LoginRequest, SongRequest, SoapEndpoint }
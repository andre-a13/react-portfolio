export interface IAddTeam {
  uuid?: string;
  name: string;
  illustrationUrl?: string;
}

export interface TeamCharacterDto {
  id: number;
  slug: string;
  name: string;
}

export interface TeamDto extends IAddTeam {
  uuid: string;
  characters?: TeamCharacterDto[];
}

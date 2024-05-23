import { Profile } from "src/models/profile/profile";
import { getRepository, Repository } from "typeorm";

export class ProfileService {
  constructor(
    private profileRepository: Repository<Profile> = getRepository(Profile)
  ) {}
  async createProfile(profileData: Partial<Profile>): Promise<Profile> {
    const newProfile = this.profileRepository.create(profileData); // TypeORM creation
    return await this.profileRepository.save(newProfile);
  }

  async findAllProfiles(): Promise<Profile[]> {
    return await this.profileRepository.find();
  }

  async findProfileById(id: number): Promise<Profile | null> {
    return await this.profileRepository.findOneBy({ id });
  }

  async updateProfile(
    id: number,
    profileData: Partial<Profile>
  ): Promise<Profile | null> {
    const profileToUpdate = await this.findProfileById(id);
    if (!profileToUpdate) return null;

    this.profileRepository.merge(profileToUpdate, profileData);
    return await this.profileRepository.save(profileToUpdate);
  }

  async deleteProfile(id: number): Promise<boolean> {
    const deleteResult = await this.profileRepository.delete(id);
    return !!deleteResult.affected; // True if deleted
  }

  async selectProfileByPin(
    email: string,
    pin: string
  ): Promise<Profile | null> {
    const selectedUser = await this.profileRepository.findOne({
      where: { email },
    });
    return selectedUser?.pin === pin ? selectedUser : null;
  }
}

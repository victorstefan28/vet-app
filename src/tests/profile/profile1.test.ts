import { mock, MockProxy } from "jest-mock-extended";
import { ProfileService } from "src/features/profile/profile.service";
import { Profile } from "src/models/profile/profile";
import { Repository } from "typeorm";

describe("ProfileService", () => {
  let profileService: ProfileService;
  let mockProfileRepository: MockProxy<Repository<Profile>>;

  beforeEach(() => {
    mockProfileRepository = mock<Repository<Profile>>();
    profileService = new ProfileService(mockProfileRepository);
  });

  it("should create a profile", async () => {
    const profileData = {
      firstName: "John",
      lastName: "Doe",
      email: "test@test.com",
      pin: "1234",
    };
    const expectedProfile = { id: 1, ...profileData };

    // Mock the repository behavior
    mockProfileRepository.create.mockReturnValue(expectedProfile);
    mockProfileRepository.save.mockResolvedValue(expectedProfile);

    const result = await profileService.createProfile(profileData);

    expect(result).toEqual(expectedProfile);
  });

  // ... More tests for other service methods ...
});

// types\api.ts


/**
 * Based on OpenAPI schema version: 3.0.0
 * API Title: TrailApp API
 * API Version: 1.0
 */



export interface ConfirmRegistrationDto {
  /**
   * The password to be set for the user account
   * @example StrongPassword123!
   */
  password: string;
  /**
   * The verification token sent to the user
   * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   */
  token: string;
}

export interface LoginRequestDto {
  /**
   * The user email
   * @example example@mail.com
   */
  email: string;
  /**
   * The user password
   * @example password1234
   */
  password: string;
}

export type UserRole =
  | 'NationalFederation'
  | 'Federation'
  | 'Organizer'
  | 'Athlete'
  | 'Official';

export interface LoginResponseDto {
  /**
   * Activation token
   * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
   */
  access_token: string;
  /**
   * User ID
   * @example 7b272313-94d1-4e06-8f33-8f00c55277d5
   */
  id: string;
  /**
   * Username
   * @example johndoe
   */
  username: string;
  /**
   * User role
   * @example Athlete
   */
  role: UserRole;
  /**
   * User email
   * @example mail@example.com
   */
  email: string;
}

export interface RecoverEmailDto {
  /**
   * Email address of the user requesting password recovery
   * @example example@mail.com
   */
  email: string;
}

export interface RecoverPasswordDto {
  /**
   * New password for the user account
   * @example newSecurePassword123
   */
  password: string;
  /**
   * Token for password recovery
   * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   */
  token: string;
}

export interface TokenValidResponseDto {
  /**
   * The user ID associated with the token
   * @example 1234567890abcdef
   */
  userId?: string;
}

export interface CreateAthleteDto {
  /**
   * User email address
   * @example user@example.com
   */
  email: string;
  /**
   * Full name
   * @example Sergio Pérez
   */
  fullName: string;
  /**
   * ID number (DNI/NIE)
   * @example 12345678A
   */
  idNumber: string;
  /**
   * Birth date
   * @format date-time
   * @example 1990-01-01
   */
  dateOfBirth: string;
}

export interface AthleteResponseDto {
  /**
   * Athlete ID
   * @example f6d5e4c3-2b1a-4d9c-8f7e-0e9f8e7e6d5c
   */
  id: string;
  /**
   * Athlete name
   * @example John Doe
   */
  fullName: string;
  /**
   * Athlete bib number
   * @example 42
   */
  dorsal?: number;
  /**
   * Whether athlete is disqualified
   * @example false
   */
  isDisqualified?: boolean;
}

export interface UpdateAthleteDto {
  /**
   * Email
   * @example example@mail.com
   */
  email: string;
  /**
   * Full name
   * @example Sergio Pérez
   */
  fullName: string;
  /**
   * ID number (DNI/NIE)
   * @example 12345678A
   */
  idNumber: string;
  /**
   * Birth date
   * @format date-time
   * @example 1990-01-01
   */
  dateOfBirth: string;
}

export interface CreateFederationDto {
  /**
   * User email address
   * @example user@example.com
   */
  email: string;
  /**
   * Federation region
   * @example Castilla y León
   */
  region: string;
  /**
   * Federation code, must contain exactly 3 letters
   * @example CYL
   */
  code: string;
}

export interface FederationResponseDto {
  /** @example 8e2d48a4-654b-42b1-8e20-33c16a2e7bb4 */
  id: string;
  /** @example federation@example.com */
  email: string;
  /** @example Federación de Castilla y León */
  name: string;
  /** @example Castilla y León */
  region: string;
  /** @example CYL */
  code: string;
}

export interface FederationNameResponseDto {
  /** @example Castilla y León */
  region: string;
}

export interface UpdateFederationDto {
  /**
   * Federation email
   * @example example@mail.com
   */
  email: string;
}

export interface ProvinceResponseDto {
  /**
   * Unique identifier for the province
   * @example 01
   */
  id: string;
  /**
   * Name of the province
   * @example Madrid
   */
  name: string;
}

export interface LocationResponseDto {
  /**
   * Unique identifier for the location
   * @example 12345
   */
  id: string;
  /**
   * Name of the location
   * @example Coslada
   */
  name: string;
}

export interface CreateOfficialDto {
  /**
   * User email address
   * @example user@example.com
   */
  email: string;
  /**
   * Full name of the official
   * @example Maria Lopez
   */
  fullName: string;
  /**
   * Code of the federation to which the official belongs
   * @example CYL
   */
  federationCode: string;
  /**
   * License number of the official
   * @example AV123
   */
  license: string;
}

export interface OfficialResponseDto {
  /** @example 8e2d48a4-654b-42b1-8e20-33c16a2e7bb4 */
  id: string;
  /** @example CYL */
  federationCode: string;
  /** @example AV8 */
  license: string;
  /** @example true */
  validatedByFederation: boolean;
  /** @example official@example.com */
  email: string;
  /** @example John Doe */
  fullName: string;
}

export interface UpdateOfficialDto {
  /**
   * Official name
   * @example Roberto Salazar
   */
  fullName?: string;
  /**
   * User email address
   * @example user@example.com
   */
  email: string;
}

export interface CreateOrganizerDto {
  /**
   * User email address
   * @example user@example.com
   */
  email: string;
  /**
   * Organizer name
   * @example Club Valladolid
   */
  name: string;
  /**
   * Federation code
   * @example CYL
   */
  federationCode: string;
}

export interface OrganizerResponseDto {
  /**
   * User ID
   * @example 8e2d48a4-654b-42b1-8e20-33c16a2e7bb4
   */
  id: string;
  /**
   * User email
   * @example organizer@example.com
   */
  email: string;
  /**
   * User name
   * @example Club de trail running
   */
  name: string;
  /**
   * Federation code
   * @example CYL
   */
  federationCode: string;
  /**
   * Organizer code
   * @example CYL1
   */
  organizerCode: string;
}

export interface UpdateOrganizerDto {
  /**
   * Organizer name
   * @example Club Valladolid
   */
  name?: string;
  /**
   * User email address
   * @example user@example.com
   */
  email: string;
}

export interface CreateEventDto {
  /**
   * Event name
   * @example Trail Valle de Los Chillos
   */
  name: string;
  /**
   * Event date
   * @format date-time
   * @example 2025-04-13
   */
  date: string;
  /**
   * Event location
   * @example Cardeñosa
   */
  location: string;
  /**
   * Event province
   * @example Ávila
   */
  province: string;
  /**
   * Event distances
   * @example [5, 10, 15]
   */
  distances: string[];
}

export interface EventWithCoordinatesDto {
  /** Event ID */
  id: string;
  /** Event name */
  name: string;
  /**
   * Event date
   * @format date-time
   */
  date: string;
  /** Event location */
  location: string;
  /** Event province */
  province: string;
  /** Validation status */
  validated: boolean;
  /** Event distances */
  distances: string[];
  /** Event coordinates */
  coordinates: number[];
}

export interface EventPaginatedEventWithCoordinatesResponseDto {
  /** List of events with coordinates */
  data: EventWithCoordinatesDto[];
  /** Total number of events */
  total: number;
  /** Current page number */
  page: number;
  /** Number of items per page */
  pageSize: number;
}

export interface EventResponseDto {
  /** Event ID */
  id: string;
  /** Event name */
  name: string;
  /**
   * Event date
   * @format date-time
   */
  date: string;
  /** Event location */
  location: string;
  /** Event province */
  province: string;
  /** Validation status */
  validated: boolean;
  /** Event distances */
  distances: string[];
}

export interface EventFederationResponseDto {
  /** Event ID */
  id: string;
  /** Event name */
  name: string;
  /**
   * Event date
   * @format date-time
   */
  date: string;
  /** Event location */
  location: string;
  /** Event province */
  province: string;
  /** Validation status */
  validated: boolean;
  /** Event distances */
  distances: string[];
  /** Federation name */
  federation: string;
}

export interface EventNameResponseDto {
  /**
   * Event ID
   * @example 78a66519-5f84-4927-a662-47466d2cf492
   */
  id: string;
  /**
   * Event name
   * @example Trail de la Cueva
   */
  name: string;
}

export interface OrganizerForEventResponseDto {
  /**
   * Organizer ID
   * @example 8e2d48a4-654b-42b1-8e20-33c16a2e7bb4
   */
  id: string;
  /**
   * Organizer name
   * @example Club de Trail Running
   */
  name: string;
  /**
   * Organizer email
   * @example organizer@example.com
   */
  email: string;
}

export interface EventOrganizerResponseDto {
  /** 
   * Event ID
   * @example 78a66519-5f84-4927-a662-47466d2cf492
   */
  id: string;
  /** 
   * Event name 
   * @example Trail de la Cueva
   */
  name: string;
  /**
   * Event date
   * @format date-time
   */
  date: string;
  /** Event location
   * @example Valladolid
   */
  location: string;
  /** Event province 
   * @example Valladolid
  */
  province: string;
  /** 
   * Validation status 
   * @example true
  */
  validated: boolean;
  /** Event distances 
   * @example ["10", "21", "42"]
  */
  distances: string[];
  /** 
   * Event latitude
   * @example 41.6528
   */
  latitude: number;
  /** 
   * Event longitude 
   * @example -4.7286
   */
  longitude: number;
  /** Organizer */
  organizer: OrganizerForEventResponseDto;
}

export interface UpdateEventDto {
  /**
   * Event name
   * @example New Year
   */
  name?: string;
  /**
   * Event date
   * @example 2024-12-31
   */
  date?: string;
}

export interface TodayJuryEventResponseDto {
  /**
   * Name of the event
   * @example Trail de la Sierra de Cazorla
   */
  name: string;
  /**
   * Id of the event
   * @example 51b4603f-753f-41ac-a4d3-8d42628684e1
   */
  id: string;
  /**
   * Indicates whether the user is a referee
   * @example true
   */
  isReferee: boolean;
  /**
   * Date of the event
   * @format date-time
   * @example 2023-06-15
   */
  date: string;
  /**
   * Location of the event
   * @example Cazorla, Jaén
   */
  location: string;
  /**
   * Province of the event
   * @example Jaén
   */
  province: string;
}

export interface JuryResponseDto {
  /**
   * Unique identifier for the jury entry
   * @example 18e61290-3f92-48a4-bf2d-a5e1a78cc8bb
   */
  id: string;
  /**
   * Event identifier associated with the jury
   * @example 51b4603f-753f-41ac-a4d3-8d42628684e1
   */
  eventId: string;
  /**
   * User identifier who holds the jury position
   * @example e9f8d7c6-5b4a-43d2-9e0f-9f8a7e6b5c4d
   */
  userId: string;
  /**
   * Role of the user in the event
   * @example Juez Árbitro
   */
  role: string;
  /**
   * Indicates whether the user is a referee
   * @example true
   */
  isReferee: boolean;
  /**
   * Indicates whether the jury is national or not
   * @example true
   */
  isNational: boolean;
}

export interface AddJuryDto {
  /**
   * The id of the user
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  userId: string | null;
  /**
   * The role of the user
   * @example Juez Árbitro
   */
  role: string;
  /**
   * If the designation is national
   * @example false
   */
  isNational: boolean;
  /**
   * If the user is referee
   * @example true
   */
  isReferee: boolean;
}

export interface AddJuryListDto {
  /** List of jury members */
  juries: AddJuryDto[];
}

export interface EventWithEnrollmentDto {
  /** Event ID */
  id: string;
  /** Event name */
  name: string;
  /**
   * Event date
   * @format date-time
   */
  date: string;
  /** Event location */
  location: string;
  /** Event province */
  province: string;
  /** Validation status */
  validated: boolean;
  /** Event distances */
  distances: string[];
  /**
   * If the user is enrolled in the event
   * @example true
   */
  enrolled: boolean;
  /**
   * The distance enrolled
   * @example 10
   */
  enrolledDistance?: number;
}

export interface EnrollEventDto {
  /**
   * The id of the event
   * @example 51b4603f-753f-41ac-a4d3-8d42628684e1
   */
  eventId: string;
  /**
   * The id of the user
   * @example f6d5e4c3-2b1a-4d9c-8f7e-0e9f8e7e6d5c
   */
  userId: string;
  /**
   * Distance of the event enrolled
   * @example 10
   */
  distance: number;
}

export interface UnEnrollEventDto {
  /**
   * The id of the event
   * @example 51b4603f-753f-41ac-a4d3-8d42628684e1
   */
  eventId: string;
  /**
   * The id of the user
   * @example f6d5e4c3-2b1a-4d9c-8f7e-0e9f8e7e6d5c
   */
  userId: string;
}

export interface AthleteListItemDto {
  /**
   * The dorsal of the athlete
   * @example 1
   */
  dorsal: number;
  /**
   * The name of the athlete
   * @example John Doe
   */
  name: string;
  /**
   * The dni of the athlete
   * @example 12345678Z
   */
  dni: string;
  /**
   * The birthdate of the athlete
   * @example 01/01/2000
   */
  birthdate: string;
  /**
   * The distance of the race
   * @example 10
   */
  distance: number;
}

export interface AthleteStatusResponseDto {
  /**
   * Athlete bib number
   * @example 1
   */
  dorsal: string;
  /**
   * Full name of the athlete
   * @example Carlos López
   */
  athleteName: string;
  /**
   * Current status of the athlete
   * @example Descalificado
   */
  status: string;
}

export type CheckPointType =
  | 'Salida'
  | 'Punto de control'
  | 'Bolsa de vida'
  | 'Meta';

export interface CheckPointResponseDto {
  /**
   * Unique identifier of the checkpoint
   * @example 277b4202-8854-4862-a3b5-956e63bcadc9
   */
  id: string;
  /**
   * Name of the checkpoint
   * @example Salida
   */
  name: string;
  /**
   * Event ID associated with the checkpoint
   * @example d3c1f85b-e693-47ef-814e-02ac1d46cfb4
   */
  eventId: string;
  /**
   * Type of checkpoint
   * @example Salida
   */
  type: CheckPointType;
  /**
   * Distances associated with this checkpoint in kilometers
   * @example [10, 25]
   */
  distances: number[];
  /**
   * Kilometer position of the checkpoint (nullable)
   * @example 7.5
   */
  kmPosition: string | null;
  /**
   * List of material IDs required at the checkpoint
   * @example ["5819a824-dad6-436f-b623-f3b8fdb3506e", "f9c4f98f-9d7a-4b37-b20b-8116c7749ae0"]
   */
  material: string[];
}

export interface EquipmentItemDto {
  /**
   * The name of the equipment
   * @example Space blanket
   */
  name: string;
  /**
   * Whether the equipment is required
   * @example false
   * @default false
   */
  optional?: boolean;
}

export interface CreateEquipmentDto {
  /**
   * Event ID for which the equipment is being created
   * @example 51b4603f-753f-41ac-a4d3-8d42628684e1
   */
  eventId: string;
  /** List of required equipment */
  equipment: EquipmentItemDto[];
}

export interface EquipmentResponseDto {
  /**
   * Equipment ID
   * @example 3fa85f64-5717-4562-b3fc-2c963f66afa6
   */
  id: string;
  /**
   * Equipment name
   * @example First Aid Kit
   */
  name: string;
  /**
   * Whether the equipment is optional
   * @example false
   */
  optional: boolean;
  /**
   * Event ID this equipment belongs to
   * @example 3fa85f64-5717-4562-b3fc-2c963f66afa6
   */
  eventId: string;
}

export interface CreateDisqualificationDto {
  /**
   * Reason for disqualification
   * @example Outside assistance received
   * @maxLength 50
   */
  reason: string;
  /**
   * Detailed description
   * @example Athlete received water from spectator at km 25
   */
  description: string;
  /**
   * Event ID
   * @example 51b4603f-753f-41ac-a4d3-8d42628684e1
   */
  eventId: string;
  /**
   * Athlete ID
   * @example f6d5e4c3-2b1a-4d9c-8f7e-0e9f8e7e6d5c
   */
  athleteId: string;
}

export interface DisqualificationResponseDto {
  /**
   * Report ID
   * @example e9276f71-fcd1-40ab-8370-ac75a19d31b0
   */
  id: string;
  /** Athlete information */
  athlete: AthleteResponseDto;
  /** Official information */
  official: OfficialResponseDto;
  /**
   * Creation timestamp
   * @format date-time
   */
  createdAt: string;
  /**
   * Disqualification reason
   * @example Outside assistance
   */
  reason: string;
  /**
   * Detailed description
   * @example Received water from spectator
   */
  description: string;
  /**
   * Review status
   * @example false
   */
  reviewedByReferee: boolean;
  /**
   * Report status
   * @example PENDING
   */
  status: string;
}

export type DisqualificationStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED';

export interface UpdateDisqualificationDto {
  /**
   * Status of the disqualification report
   * @example APPROVED
   */
  status: DisqualificationStatus;
}

export interface CreateMaterialCheckDto {
  /**
   * The ID of the control point where the check is being made
   * @example b1a2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6
   */
  controlPointId: string;
  /**
   * The athlete assigned to the control
   * @example 2ef4dc48-eb12-4c53-8f45-c8d0986f0567
   */
  athlete: string;
  /**
   * Selected materials for the control
   * @example ["75453f4f-b04b-48df-b53b-f2bf86d01808", "e4b602f1-dae4-4bd7-ae7d-50dcf3cd414d"]
   */
  material: string[];
}

export interface CarryingEquipmentResponseDto {
  /**
   * List of materials carried by the athlete
   * @example ["070e2a5a-1e2a-4342-9971-b08ee7d61601", "a587acc2-868b-43f9-8856-2dd86e4446c2"]
   */
  materials: string[];
  /**
   * ID of the event
   * @example a587acc2-868b-43f9-8856-2dd86e4446c2
   */
  eventId: string;
  /**
   * ID of the athlete
   * @example f51c1c37-4760-41da-9380-2a0caadb9fd2
   */
  athleteId: string;
}

export interface CheckEnrollmentResponseDto {
  /**
   * ID of the athlete
   * @example d53f3e47-3232-4f29-9d26-1e0a3f5fde0c
   */
  id: string;
  /**
   * User email address
   * @example user@example.com
   */
  email: string;
  /**
   * User display name
   * @example John Doe
   */
  displayName: string;
  /**
   * User creation date
   * @format date-time
   * @example 2023-01-01T00:00:00.000Z
   */
  createdAt: string;
  /**
   * User last update date
   * @format date-time
   * @example 2023-01-02T00:00:00.000Z
   */
  updatedAt?: string | null;
  /**
   * Name of the athlete
   * @example Leonardo
   */
  name: string;
  /**
   * Unique dorsal number of the athlete
   * @example 1
   */
  dorsal: number;
  /**
   * Whether the athlete is disqualified
   * @example false
   */
  isDisqualified: boolean;
}

export interface MessageWithSenderResponseDto {
  /**
   * The id of the message
   * @example e90de20e-12fd-4abb-80dd-7981c02477ba
   */
  id: string;
  /**
   * The message content
   * @example Hello, how are you?
   */
  message: string;
  /**
   * The sender of the message
   * @example 222ffe36-3b23-48bc-a05c-7d7bbf9a7382
   */
  senderId: string;
  /**
   * The sender of the message
   * @example John Doe
   */
  senderName: string;
  /**
   * The role of the sender
   * @example athlete
   */
  senderRole: UserRole;
  /**
   * The date of the message
   * @format date-time
   * @example 2021-10-10T10:00:00.000Z
   */
  createdAt: string;
}


/**
 * Placeholder for CreateStartEndCheckPointDto.
 * You might need to define this based on actual API requirements if different from CreateCheckPointDto.
 * Often, 'start' and 'end' checkpoints might have fewer fields (e.g., no kmPosition for start).
 */
export interface CreateStartEndCheckPointDto {
  name: string;
  eventId: string;
  type: 'Salida' | 'Meta';
  distances: number[];
  material?: string[];
}

/**
 * Placeholder for CreateCheckPointDto (regular checkpoint).
 */
export interface CreateCheckPointDto {
  name: string;
  eventId: string;
  type: 'Punto de control' | 'Bolsa de vida';
  distances: number[];
  kmPosition: string;
  material?: string[];
}

export type CreateCheckPointRequestBody = CreateStartEndCheckPointDto | CreateCheckPointDto;
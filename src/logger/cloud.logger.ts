import { ConsoleLogger } from '@nestjs/common';

class CloudLogger extends ConsoleLogger {
  /* Ubah behaviour logger disini untuk melakukan logging di GCP */
}

export default CloudLogger;
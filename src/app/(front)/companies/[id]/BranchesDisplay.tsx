"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableThead,
  TableTbody,
  TableTr,
  Text,
  Alert,
  ActionIcon,
} from "@mantine/core";
import { CompanyBranchWithLocation } from "../../../api/companies/[id]/locations/route";
import { useMediaQuery } from "@mantine/hooks";
import Address from "@/components/Address/Address";
import { displayMode } from "./BranchesSwitch";
import { IconClockPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const BranchesDisplay = ({
  id,
  switchModeAction,
}: {
  id: number;
  switchModeAction: (mode: displayMode) => void;
}) => {
  const [branches, setBranches] = useState<CompanyBranchWithLocation[] | null>(
    null,
  );
  const [error, setError] = useState<Error | null>(null);
  const isMobile = useMediaQuery("md");
  const { data: session, status } = useSession();
  const fetchBranches = (companyId: number) => {
    fetch(`/api/companies/${companyId}/locations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Nepodařilo se načíst pobočky firmy");
      })
      .then((data) => {
        setBranches(data);
      })
      .catch((error) => {
        setError(error);
      });
  };
  useEffect(() => {
    fetchBranches(id);
  }, [id]);
  if (error) {
    return (
      <Alert color="red" title="Chyba">
        {error.message}
      </Alert>
    );
  }
  if (branches?.length === 0) {
    return <Text>Firma nemá žádné pobočky</Text>;
  }
  return (
    <>
      <Table>
        <TableThead>
          <TableTr>
            <Table.Th>Název</Table.Th>
            <Table.Th>Obec</Table.Th>
            <Table.Th>Adresa</Table.Th>
            <Table.Th>Akce</Table.Th>
          </TableTr>
        </TableThead>
        <TableTbody>
          {branches?.map((branch, index) => (
            <TableTr key={index}>
              <Table.Td>{branch.name}</Table.Td>
              <Table.Td>{branch.location?.municipality ?? "?"}</Table.Td>
              <Table.Td>
                <Address
                  municipality={branch.location.municipality ?? ""}
                  street={branch.location.street ?? null}
                  country={branch.location.country ?? ""}
                  descNum={branch.location.descNo ?? null}
                  orientNum={branch.location.orientNo ?? null}
                  postalCode={branch.location.postalCode ?? null}
                />
              </Table.Td>
              <Table.Td>
                {session?.user ? (
                  <ActionIcon
                    variant="light"
                    component={Link}
                    href={
                      "/internships/create/1?company=" +
                      id +
                      "&location=" +
                      branch.locationId
                    }
                    color="green"
                    aria-label="Založení praxe"
                  >
                    <IconClockPlus />
                  </ActionIcon>
                ) : null}{" "}
              </Table.Td>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </>
  );
};

export default BranchesDisplay;